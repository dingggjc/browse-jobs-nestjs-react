import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetJobs } from "@/hooks/useGetJobs"
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useDebounce } from "use-debounce"

const CATEGORIES = ["Engineering", "Design"]
const TYPES = ["Full-time", "Contract"]

export default function JobPosting() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get("category") ?? ""
  const type = searchParams.get("type") ?? ""
  const page = searchParams.get("page") ?? "1"
  const search = searchParams.get("search") ?? ""

  const [searchInput, setSearchInput] = useState(search)
  const [debouncedSearch] = useDebounce(searchInput, 500)

  const { jobs, isLoading, isError } = useGetJobs({
    category,
    type,
    page,
    limit: "5",
    search: debouncedSearch,
  })

  function updateFilter(key: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === "all" || value === "") {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      next.set("page", "1")
      return next
    })
  }

  function updatePage(newPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("page", String(newPage))
      return next
    })
  }

  useEffect(() => {
    updateFilter("search", debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <aside className="w-full shrink-0 space-y-6 md:w-48">
        <div className="space-y-2">
          <p className="text-sm font-medium">Category</p>
          <Select
            value={category || "all"}
            onValueChange={(value) => updateFilter("category", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Type</p>
          <Select
            value={type || "all"}
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </aside>

      <Separator className="hidden h-auto md:block" orientation="vertical" />

      <div className="flex-1 space-y-4">
        <Input
          type="search"
          placeholder="Search jobs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}

        {isError && (
          <p className="text-sm text-red-500">
            Something went wrong. Please try again.
          </p>
        )}

        {!isLoading && !isError && jobs?.data.length === 0 && (
          <p className="text-sm text-muted-foreground">No jobs found.</p>
        )}

        {jobs?.data.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle className="text-base">{job.title}</CardTitle>
              <CardDescription>
                {job.company} · {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex gap-2">
                <Badge variant="outline">{job.category}</Badge>
                <Badge variant="outline">{job.type}</Badge>
              </div>
              {job.salary && (
                <p className="text-sm font-medium">{job.salary}</p>
              )}
              <p className="text-sm text-muted-foreground">{job.description}</p>
            </CardContent>
          </Card>
        ))}

        {jobs && jobs.meta.totalPages > 1 && (
          <div className="flex items-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={jobs.meta.page <= 1}
              onClick={() => updatePage(jobs.meta.page - 1)}
            >
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {jobs.meta.page} of {jobs.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={jobs.meta.page >= jobs.meta.totalPages}
              onClick={() => updatePage(jobs.meta.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
