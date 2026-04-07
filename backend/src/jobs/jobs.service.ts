import { Injectable } from '@nestjs/common';
import { mockJobs } from './data/mock-jobs';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';

@Injectable()
export class JobsService {
  private readonly jobs = mockJobs;

  findAll(query: GetJobsQueryDto) {
    let filtered = [...this.jobs];

    if (query.category) {
      filtered = filtered.filter(
        (j) => j.category.toLowerCase() === query.category!.toLowerCase(),
      );
    }

    if (query.type) {
      filtered = filtered.filter(
        (j) => j.type.toLowerCase() === query.type!.toLowerCase(),
      );
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      data: paginated,
      meta: { total, page, limit, totalPages },
    };
  }
}
