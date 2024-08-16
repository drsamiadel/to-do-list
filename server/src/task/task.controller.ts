import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-tsk.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { TasksResponse } from './@types/tasksResponse';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getAllTasks(
    @Query() query: ExpressQuery,
    @Req() req,
  ): Promise<TasksResponse> {
    return await this.taskService.findAll(query, req.user);
  }

  @Get('/categories')
  @UseGuards(AuthGuard())
  async getAllCategories(@Req() req): Promise<string[]> {
    return await this.taskService.allCategories(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async getTaskById(@Param('id') id: string, @Req() req): Promise<Task> {
    return await this.taskService.findById(id, req.user);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createTask(@Body() task: CreateTaskDto, @Req() req): Promise<Task> {
    return await this.taskService.create(task, req.user);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateTaskById(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
    @Req() req,
  ): Promise<Task> {
    return await this.taskService.updateById(id, task, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteTaskById(@Param('id') id: string, @Req() req): Promise<Task> {
    return await this.taskService.deleteById(id, req.user);
  }
}
