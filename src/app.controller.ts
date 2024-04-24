import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('users')
export class AppController implements OnModuleInit {
  private userService;
  constructor(
    private readonly appService: AppService,
    @Inject('USERS_SERVICE') private client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.userService = this.client.getService('UsersService');
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ description: 'User registration details', type: 'object' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  register(@Body() data: any) {
    const result = this.userService.register(data);
    console.log(result);

    return result.access_token;
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ description: 'User login details', type: 'object' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  login(@Body() data: any): Observable<any> {
    return this.userService.login(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  findAll(): Observable<any> {
    return this.userService.findAll({});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details by ID' })
  findOne(@Param('id') id: string): Observable<any> {
    return this.userService.findOne({ id });
  }
}
