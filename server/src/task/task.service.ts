import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { Query } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';
import * as mongoose from 'mongoose';
import { TasksResponse } from './@types/tasksResponse';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name)
    private taskModel: mongoose.Model<Task>,
  ) {}

  async findAll(query: Query, user: User): Promise<TasksResponse> {
    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = query.category
      ? {
          category: {
            $regex: query.category,
            $options: 'i',
          },
        }
      : {};

    const completed = query.completed
      ? {
          completed: query.completed,
        }
      : {};

    const totalTasks = await this.taskModel.countDocuments({
      ...keyword,
      ...category,
      ...completed,
      author: user._id,
    });

    const page = parseInt(query.page as string, 10) || 1;
    const resPerPage = parseInt(query.limit as string, 10) || 10;
    const skip = resPerPage * (page - 1);
    const pagination = {
      currentPage: page,
      resPerPage,
      totalTasks,
      totalPages: Math.ceil(totalTasks / resPerPage),
    };

    const tasks = await this.taskModel
      .find({
        ...keyword,
        ...category,
        ...completed,
        author: user._id,
      })
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .limit(resPerPage)
      .skip(skip)
      .exec();

    return {
      tasks,
      pagination,
    };
  }

  async findById(id: string, user: User): Promise<Task> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`Please provide a valid task ID.`);
    }

    const task = await this.taskModel
      .findOne({
        _id: id,
        author: user._id,
      })
      .populate('author', 'name email');

    if (!task) {
      throw new NotFoundException(`Task not found.`);
    }

    return task;
  }

  async create(task: Task, user: User): Promise<Task> {
    const data = Object.assign(task, { author: user._id });
    const newTask = await this.taskModel.create(data);
    return (await newTask.save()).populate('author', 'name email');
  }

  async updateById(id: string, task: Task, user: User): Promise<Task> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`Please provide a valid task ID.`);
    }

    const updatedTask = await this.taskModel.findOneAndUpdate(
      {
        _id: id,
        author: user._id,
      },
      task,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTask) {
      throw new NotFoundException(`Task not found.`);
    }

    return updatedTask;
  }

  async deleteById(id: string, user: User): Promise<Task> {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException(`Please provide a valid task ID.`);
    }

    const deletedTask = await this.taskModel.findOneAndDelete({
      _id: id,
      author: user._id,
    });

    if (!deletedTask) {
      throw new NotFoundException(`Task not found.`);
    }

    return deletedTask;
  }

  async allCategories(user: User): Promise<string[]> {
    const categories = await this.taskModel.distinct('category', {
      author: user._id,
    });

    return categories;
  }
}
