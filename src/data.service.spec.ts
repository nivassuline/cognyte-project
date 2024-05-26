import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { DataService } from './data.service';
import { User, Todo, Comment, Post } from './interfaces/data.interface';

describe('DataService', () => {
  let service: DataService;
  let mockAxios: MockAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService],
    }).compile();

    service = module.get<DataService>(DataService);
    mockAxios = new MockAdapter(axios);

    process.env.API_URL = 'https://jsonplaceholder.typicode.com';
    process.env.USERS_ENDPOINT = '/users';
    process.env.TODOS_ENDPOINT = '/todos';
    process.env.COMMENTS_ENDPOINT = '/comments';
    process.env.POSTS_ENDPOINT = '/posts';
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('getCompanyBySearch', () => {
    it('should return companies with more than 3 completed todos and match the search string', async () => {
      const users: User[] = [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: { lat: '-37.3159', lng: '81.1496' },
          },
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets',
          },
        },
        {
          id: 2,
          name: 'Ervin Howell',
          username: 'Antonette',
          email: 'Shanna@melissa.tv',
          address: {
            street: 'Victor Plains',
            suite: 'Suite 879',
            city: 'Wisokyburgh',
            zipcode: '90566-7771',
            geo: { lat: '-43.9509', lng: '-34.4618' },
          },
          phone: '010-692-6593 x09125',
          website: 'anastasia.net',
          company: {
            name: 'Deckow-Crist',
            catchPhrase: 'Proactive didactic contingency',
            bs: 'synergize scalable supply-chains',
          },
        },
        {
          id: 3,
          name: "Clementine Bauch",
          username: "Samantha",
          email: "Nathan@yesenia.net",
          address: {
            street: "Douglas Extension",
            suite: "Suite 847",
            city: "McKenziehaven",
            zipcode: "59590-4157",
            geo: {
              lat: "-68.6102",
              lng: "-47.0653"
            }
          },
          phone: "1-463-123-4447",
          website: "ramiro.info",
          company: {
            name: "Romaguera-Jacobson",
            catchPhrase: "Face to face bifurcated interface",
            bs: "e-enable strategic applications"
          }
        },
      ];

      const todos: Todo[] = [
        { userId: 1, id: 1, title: 'Todo 1', completed: true },
        { userId: 1, id: 2, title: 'Todo 2', completed: true },
        { userId: 1, id: 3, title: 'Todo 3', completed: true },
        { userId: 1, id: 4, title: 'Todo 4', completed: true },
        { userId: 2, id: 5, title: 'Todo 5', completed: true },
        { userId: 3, id: 6, title: 'Todo 6', completed: true },
        { userId: 3, id: 7, title: 'Todo 7', completed: true },
        { userId: 3, id: 8, title: 'Todo 8', completed: true },


      ];

      mockAxios
        .onGet('https://jsonplaceholder.typicode.com/users')
        .reply(200, users);
      mockAxios
        .onGet('https://jsonplaceholder.typicode.com/todos')
        .reply(200, todos);

      const result = await service.getCompanyBySearch('rom');
      expect(result).toEqual(['Romaguera-Crona']);
    });
  });

  describe('getUsersByCompanies', () => {
    it('should return users and todo counts with the valid posts and geo location requirements by specified companies', async () => {
      const users: User[] = [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: { lat: '-37.3159', lng: '81.1496' },
          },
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets',
          },
        },
        {
          id: 2,
          name: 'Ervin Howell',
          username: 'Antonette',
          email: 'Shanna@melissa.tv',
          address: {
            street: 'Victor Plains',
            suite: 'Suite 879',
            city: 'Wisokyburgh',
            zipcode: '90566-7771',
            geo: { lat: '-43.9509', lng: '-34.4618' },
          },
          phone: '010-692-6593 x09125',
          website: 'anastasia.net',
          company: {
            name: 'Deckow-Crist',
            catchPhrase: 'Proactive didactic contingency',
            bs: 'synergize scalable supply-chains',
          },
        },
        {
          id: 3,
          name: "Clementine Bauch",
          username: "Samantha",
          email: "Nathan@yesenia.net",
          address: {
            street: "Douglas Extension",
            suite: "Suite 847",
            city: "McKenziehaven",
            zipcode: "59590-4157",
            geo: {
              lat: "",
              lng: ""
            }
          },
          phone: "1-463-123-4447",
          website: "ramiro.info",
          company: {
            name: "Romaguera-Jacobson",
            catchPhrase: "Face to face bifurcated interface",
            bs: "e-enable strategic applications"
          }
        },
      ];

      const todos: Todo[] = [
        { userId: 1, id: 1, title: 'Todo 1', completed: true },
        { userId: 1, id: 2, title: 'Todo 2', completed: true },
        { userId: 1, id: 3, title: 'Todo 3', completed: true },
        { userId: 2, id: 4, title: 'Todo 4', completed: true },
        { userId: 3, id: 5, title: 'Todo 5', completed: true },
        { userId: 3, id: 6, title: 'Todo 6', completed: true },
        { userId: 3, id: 7, title: 'Todo 7', completed: true },
      ];

      const comments: Comment[] = [
        {
          postId: 1,
          id: 1,
          name: 'Comment 1',
          email: 'comment1@example.com',
          body: 'Comment body',
        },
        {
          postId: 1,
          id: 2,
          name: 'Comment 2',
          email: 'comment2@example.com',
          body: 'Comment body',
        },
        {
          postId: 1,
          id: 3,
          name: 'Comment 3',
          email: 'comment3@example.com',
          body: 'Comment body',
        },
        {
          postId: 1,
          id: 4,
          name: 'Comment 4',
          email: 'comment4@example.com',
          body: 'Comment body',
        },
        {
          postId: 5,
          id: 5,
          name: 'Comment 5',
          email: 'comment4@example.com',
          body: 'Comment body',
        },
        {
          postId: 5,
          id: 6,
          name: 'Comment 6',
          email: 'comment4@example.com',
          body: 'Comment body',
        },
        {
          postId: 5,
          id: 7,
          name: 'Comment 7',
          email: 'comment4@example.com',
          body: 'Comment body',
        },
        {
          postId: 5,
          id: 8,
          name: 'Comment 8',
          email: 'comment4@example.com',
          body: 'Comment body',
        },

      ];

      const posts: Post[] = [
        { userId: 1, id: 1, title: 'Post 1', body: 'Post body' },
        { userId: 1, id: 2, title: 'Post 2', body: 'Post body' },
        { userId: 1, id: 3, title: 'Post 3', body: 'Post body' },
        { userId: 2, id: 4, title: 'Post 4', body: 'Post body' },
        { userId: 3, id: 5, title: 'Post 5', body: 'Post body' },
        { userId: 3, id: 6, title: 'Post 6', body: 'Post body' },
        { userId: 3, id: 7, title: 'Post 7', body: 'Post body' },

      ];

      mockAxios
        .onGet('https://jsonplaceholder.typicode.com/users')
        .reply(200, users);
      mockAxios
        .onGet('https://jsonplaceholder.typicode.com/todos')
        .reply(200, todos);
      mockAxios
        .onGet('https://jsonplaceholder.typicode.com/comments')
        .reply(200, comments);
      mockAxios
        .onGet('https://jsonplaceholder.typicode.com/posts')
        .reply(200, posts);

      const result = await service.getUsersByCompanies(['Romaguera-Crona']);
      console.log(result[0].users);
      expect(result).toEqual([
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
      ]);
    });
  });
});
