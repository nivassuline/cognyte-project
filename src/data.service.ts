import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  User,
  Comment,
  Todo,
  Post,
  SearchUsers,
} from './interfaces/data.interface';
import * as NodeCache from 'node-cache';

@Injectable()
export class DataService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 600 });
  }

  private async fetchData<T>(endpoint: string): Promise<T> {
    const cachedData = this.cache.get(endpoint);

    if (cachedData) {
      return cachedData as T;
    }

    const response = await axios.get(
      `${process.env.API_URL}${endpoint}`,
    );
    const responseData = response.data;

    this.cache.set(endpoint, responseData);

    return responseData;
  }

  private fetchAllData() {
    return Promise.all([
      this.fetchData<User[]>(process.env.USERS_ENDPOINT),
      this.fetchData<Todo[]>(process.env.TODOS_ENDPOINT),
      this.fetchData<Comment[]>(process.env.COMMENTS_ENDPOINT),
      this.fetchData<Post[]>(process.env.POSTS_ENDPOINT),
    ]);
  }

  public async getCompanyBySearch(companySearchStr: string): Promise<string[]> {
    const [users, todos] = await Promise.all([
      this.fetchData<User[]>(process.env.USERS_ENDPOINT),
      this.fetchData<Todo[]>('/todos'),
    ]);

    const userTodoCounts = {};
    todos.forEach((todo) => {
      if (todo.completed) {
        userTodoCounts[todo.userId] = (userTodoCounts[todo.userId] || 0) + 1;
      }
    });

    const companies = users
      .filter((user) => userTodoCounts[user.id] > 3)
      .map((user) => user.company.name)
      .filter((name) =>
        name.toLowerCase().includes(companySearchStr.toLowerCase()),
      );

    return companies;
  }

  public async getUsersByCompanies(
    companies: string[],
  ): Promise<{ company_name: string; users: SearchUsers[] }[]> {
    const [users, todos, comments, posts] = await this.fetchAllData();

    const postCommentsCount = {};
    comments.forEach((comment) => {
      postCommentsCount[comment.postId] =
        (postCommentsCount[comment.postId] || 0) + 1;
    });

    const postsWithEnoughComments = posts.filter(
      (post) => postCommentsCount[post.id] > 3,
    );

    const userPostCounts = {};
    postsWithEnoughComments.forEach((post) => {
      userPostCounts[post.userId] = (userPostCounts[post.userId] || 0) + 1;
    });

    const todoCountsPerUser = {};
    todos.forEach((todo) => {
      todoCountsPerUser[todo.userId] =
        (todoCountsPerUser[todo.userId] || 0) + 1;
    });

    const validUsers = users.filter(
      (user) =>
        userPostCounts[user.id] >= 1 &&
        companies.includes(user.company.name) &&
        user.address.geo.lat &&
        user.address.geo.lng,
    );

    const result = companies.map((companyName) => ({
      company_name: companyName,
      users: validUsers
        .filter((user) => user.company.name === companyName)
        .map((user) => ({
          name: user.name,
          email: user.email,
          todoCount: todoCountsPerUser[user.id] || 0,
        })),
    }));

    return result;
  }
}
