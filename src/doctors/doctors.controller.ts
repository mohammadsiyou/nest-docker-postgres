import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { DoctorsService } from "./doctors.service";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { Doctor } from "./doctor.entity";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";

@Controller('doctors')
export class DoctorsController {
    constructor(private readonly doctorsService: DoctorsService) { }

    @Get()
    findAll(): Promise<Doctor[]> {
        return this.doctorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Doctor> {
        return this.doctorsService.findOne(id);
    }

    @Post()
    create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
        return this.doctorsService.create(createDoctorDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
        return this.doctorsService.update(id, updateDoctorDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.doctorsService.remove(id);
    }
}
