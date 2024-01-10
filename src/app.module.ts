import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctors/doctor.entity';
import { Appointment } from './appointments/appointment.entity';
import { DoctorsModule } from './doctors/doctors.modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [Doctor, Appointment],
          synchronize: process.env.NODE_ENV !== 'production',
        };
      },
      inject: [ConfigService],
    }),
    DoctorsModule,
  ],
})
export class AppModule { }
