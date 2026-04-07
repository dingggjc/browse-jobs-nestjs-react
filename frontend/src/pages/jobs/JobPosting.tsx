import { Skeleton } from "@/components/ui/skeleton"
import { useGetJobs } from "@/hooks/useGetJobs"
import { useSearchParams } from "react-router-dom"

const CATEGORIES = ["Engineering", "Design"]
const TYPES = ["Full-time", "Contract"]

export default function JobPosting() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get("category") ?? ""
  const type = searchParams.get("type") ?? ""
  const page = searchParams.get("page") ?? "1"

  const { jobs, isLoading, isError } = useGetJobs({
    category,
    type,
    page,
    limit: "5",
  })

  function updateFilter(key: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
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

  return (
    <div className="flex gap-8">
      <aside className="w-48 shrink-0 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select
            value={category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
          >
            <option value="">All</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <div className="flex-1 space-y-4">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-4">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
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
          <div key={job.id} className="space-y-1 rounded-lg border p-4">
            <h2 className="text-base font-semibold">{job.title}</h2>
            <p className="text-sm text-muted-foreground">
              {job.company} · {job.location}
            </p>
            <div className="flex gap-2 text-xs">
              <span className="rounded border px-2 py-0.5">{job.category}</span>
              <span className="rounded border px-2 py-0.5">{job.type}</span>
            </div>
            {job.salary && <p className="text-sm">{job.salary}</p>}
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>
        ))}

        {jobs && jobs.meta.totalPages > 1 && (
          <div className="flex gap-2 pt-4">
            <button
              disabled={jobs.meta.page <= 1}
              onClick={() => updatePage(jobs.meta.page - 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <span className="self-center text-sm">
              Page {jobs.meta.page} of {jobs.meta.totalPages}
            </span>
            <button
              disabled={jobs.meta.page >= jobs.meta.totalPages}
              onClick={() => updatePage(jobs.meta.page + 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
