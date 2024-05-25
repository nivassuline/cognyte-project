import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { DataService } from './data.service';

describe('AppController', () => {
  let appController: AppController;
  let dataService: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: DataService,
          useValue: {
            getCompanyBySearch: jest.fn(),
            getUsersByCompanies: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    dataService = module.get<DataService>(DataService);
  });

  describe('getData', () => {
    it('should return all results if empty search string', async () => {
      const companies = ['Romaguera-Crona', 'Deckow-Crist'];
      const mockCompanyUsers = [
        {
          company_name: 'Romaguera-Crona',
          users: [
            {
              name: 'Leanne Graham',
              email: 'Sincere@april.biz',
              todoCount: 3,
            },
          ],
        },
        {
          company_name: 'Deckow-Crist',
          users: [
            {
              name: 'Ervin Howell',
              email: 'Shanna@melissa.tv',
              todoCount: 3,
            },
          ],
        },
      ];

      jest
        .spyOn(dataService, 'getCompanyBySearch')
        .mockResolvedValue(companies);
      jest
        .spyOn(dataService, 'getUsersByCompanies')
        .mockResolvedValue(mockCompanyUsers);

      const result = await appController.getData('');
      expect(result).toEqual({ companies: mockCompanyUsers });
      expect(dataService.getCompanyBySearch).toHaveBeenCalledWith('');
      expect(dataService.getUsersByCompanies).toHaveBeenCalledWith(companies);
    });
  });
});
