import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Other')
@Controller('other')
export class OtherController {
    @Get('pengeluaranImg/:imgpath')
    public async seeUploadedFilePengeluaran(@Res() res, @Param('imgpath') image:string) {
        return res.sendFile(image, { root: './uploads/pengeluaran' });
    }
    @Get('pemasukanImg/:imgpath')
    public async seeUploadedFilePemasukan(@Res() res, @Param('imgpath') image:string) {
        return res.sendFile(image, { root: './uploads/pemasukan' });
    }
}
