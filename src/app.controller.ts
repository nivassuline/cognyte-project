import { Controller, Get, Query } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('get_data')
export class AppController {
  constructor(private readonly dataService: DataService) {}

  @Get()
  async getData(@Query('company') companySearchStr: string) {
    const companies = await this.dataService.getCompanyBySearch(
      companySearchStr || '',
    );
    const companyUsers = await this.dataService.getUsersByCompanies(companies);

    return { companies: companyUsers };
  }
}
