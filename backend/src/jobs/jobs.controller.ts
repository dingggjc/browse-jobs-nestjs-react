import { Controller, Get, Query } from '@nestjs/common';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  findAll(@Query() query: GetJobsQueryDto) {
    return this.jobsService.findAll(query);
  }
}
