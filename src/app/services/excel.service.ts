import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private datePipe: DatePipe) {}

  async generateExcel() {
    // const ExcelJS = await import('exceljs');
    // console.log(ExcelJS);
    // const Workbook: any = {};

    // Excel Title, Header, Data
    const title = 'Car Sell Report';
    const header = ['Year', 'Month', 'Make', 'Model', 'Quantity', 'Pct'];
    const data = [
      [2007, 1, 'Volkswagen ', 'Volkswagen Passat', 1267, 10],
      [2007, 1, 'Toyota ', 'Toyota Rav4', 819, 6.5],
      [2007, 1, 'Toyota ', 'Toyota Avensis', 787, 6.2],
      [2007, 1, 'Volkswagen ', 'Volkswagen Golf', 720, 5.7],
      [2007, 1, 'Toyota ', 'Toyota Corolla', 691, 5.4],
      [2007, 1, 'Peugeot ', 'Peugeot 307', 481, 3.8],
      [2008, 1, 'Toyota ', 'Toyota Prius', 217, 2.2],
      [2008, 1, 'Skoda ', 'Skoda Octavia', 216, 2.2],
      [2008, 1, 'Peugeot ', 'Peugeot 308', 135, 1.4],
      [2008, 2, 'Ford ', 'Ford Mondeo', 624, 5.9],
      [2008, 2, 'Volkswagen ', 'Volkswagen Passat', 551, 5.2],
      [2008, 2, 'Volkswagen ', 'Volkswagen Golf', 488, 4.6],
      [2008, 2, 'Volvo ', 'Volvo V70', 392, 3.7],
      [2008, 2, 'Toyota ', 'Toyota Auris', 342, 3.2],
      [2008, 2, 'Volkswagen ', 'Volkswagen Tiguan', 340, 3.2],
      [2008, 2, 'Toyota ', 'Toyota Avensis', 315, 3],
      [2008, 2, 'Nissan ', 'Nissan Qashqai', 272, 2.6],
      [2008, 2, 'Nissan ', 'Nissan X-Trail', 271, 2.6],
      [2008, 2, 'Mitsubishi ', 'Mitsubishi Outlander', 257, 2.4],
      [2008, 2, 'Toyota ', 'Toyota Rav4', 250, 2.4],
      [2008, 2, 'Ford ', 'Ford Focus', 235, 2.2],
      [2008, 2, 'Skoda ', 'Skoda Octavia', 225, 2.1],
      [2008, 2, 'Toyota ', 'Toyota Yaris', 222, 2.1],
      [2008, 2, 'Honda ', 'Honda CR-V', 219, 2.1],
      [2008, 2, 'Audi ', 'Audi A4', 200, 1.9],
      [2008, 2, 'BMW ', 'BMW 3-serie', 184, 1.7],
      [2008, 2, 'Toyota ', 'Toyota Prius', 165, 1.6],
      [2008, 2, 'Peugeot ', 'Peugeot 207', 144, 1.4]
    ];

    // Create workbook and worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Car Data');

    // Add Row and formatting
    const titleRow = worksheet.addRow([title]);
    titleRow.font = {
      name: 'Comic Sans MS',
      family: 4,
      size: 16,
      underline: 'double',
      bold: true
    };
    titleRow.alignment = { horizontal: 'center' };
    worksheet.addRow([]);
    const subTitleRow = worksheet.addRow([
      'Date : ' + this.datePipe.transform(new Date(), 'medium')
    ]);

    // Add Image
    // const logo = workbook.addImage({
    //   base64: logoFile.logoBase64,
    //   extension: 'png'
    // });

    // worksheet.addImage(logo, 'E1:F3');
    worksheet.mergeCells('A1:D2');

    // Blank Row
    worksheet.addRow([]);

    // Add Header Row
    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    // worksheet.addRows(data);

    // Add Data and Conditional Formatting
    data.forEach(d => {
      const row = worksheet.addRow(d);
      const qty = row.getCell(5);
      let color = 'FF99FF99';
      if (+qty.value < 500) {
        color = 'FF9999';
      }

      qty.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      };
    });

    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);

    // Footer Row
    const footerRow = worksheet.addRow([
      'This is system generated excel sheet.'
    ]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFCCFFE5' }
    };
    footerRow.getCell(1).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate Excel File with given name
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, 'CarData.xlsx');
    });
  }

  async customExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Client');

    // Add Header Row
    const headerRow = worksheet.addRow([
      'ClientId',
      'Client Name',
      'Client Email'
    ]);

    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'A9A9A9' },
        bgColor: { argb: 'A9A9A9' }
      };
      // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    for (let i = 0; i < 2; i++) {
      const row = worksheet.addRow([96, 'test test ast', 'sdfff@yopmail.com']);

      // Second Level
      const headerRowSecond = worksheet.addRow([
        '',
        'Location Id',
        'Location Name',
        'Location Address'
      ]);

      headerRowSecond.eachCell((cell, number) => {
        console.log('cell:', cell);

        console.log('number:', number);
        if (number != 1) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'C0C0C0' },
            bgColor: { argb: 'C0C0C0' }
          };
          cell.font = { color: { argb: 'FFFFFF' }, bold: true };
          // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        }
      });

      worksheet.addRow([
        '',
        129,
        'Ahmedabad test',
        'Hansol, Ahmedabad, Gujarat 380003, India'
      ]);

      // Thired Level
      const headerRowThired = worksheet.addRow([
        '',
        '',
        'Area Id',
        'Area Name',
        'Area Address',
        'Area Lat',
        'Area Long'
      ]);

      headerRowThired.eachCell((cell, number) => {
        if (number != 1 && number != 2) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'DCDCDC' },
            bgColor: { argb: 'DCDCDC' }
          };
          // cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        }
      });

      worksheet.addRow([
        '',
        '',
        122,
        'rajastan',
        'Hansol, Ahmedabad, Gujarat 380003, India',
        '23.0734262',
        '72.626571'
      ]);
    }

    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 10;

    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, 'Client.xlsx');
    });
  }

  /**
   *
   * @param worksheet - pass worksheet
   * @param config - pass TitleConfig
   * @returns returns worksheet object
   */
  makeTitle(worksheet, config: TitleConfig) {
    // mergeCellAddress = 'A1:D2'
    const titleRow = worksheet.addRow([config.titleName]);
    titleRow.font = {
      name: config.font.name || 'Cambria',
      family: config.font.family || 4,
      size: config.font.size || 16,
      bold: config.font.bold || false
    };

    config.alignment = config.alignment || { horizontal: 'center' };
    titleRow.alignment = { horizontal: config.alignment.horizontal };

    worksheet.addRow([]);

    if (config.mergeCellAddress) worksheet.mergeCells(config.mergeCellAddress);

    return worksheet;
  }

  /**
   *
   * @param worksheet - pass worksheet
   * @param columnWidth - Array Of ColumnWidth
   * @returns returns worksheet object
   */
  columnWidth(worksheet, columnWidth: Array<ColumnWidth>) {
    columnWidth.forEach(item => {
      worksheet.getColumn(item.columnNumber).width = item.width;
    });

    return worksheet;
  }

  /**
   *
   * @param workSheetname - pass worksheet name in string
   * @returns returns workbook and worksheet object
   */
  makeWorkSheet(workSheetname: string) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(`${workSheetname}`);
    return { workbook, worksheet };
  }

  /**
   *
   * @param space pass number of space
   * @returns returns spaces array
   */
  makeSpaces(space: number) {
    let spaces = [];

    for (let i = 0; i < space; i++) {
      spaces.push('');
    }
    return spaces;
  }

  /**
   *
   * @param worksheet - Pass worksheet
   * @param column ['ClientId', 'Client Name', 'Client Email']
   * @param config - { spaces: 0 , colors: { bgColor: 'A9A9A9', fgColor: 'A9A9A9' } }
   * @returns return worksheet
   */
  makeHeader(worksheet, columns: Array<Level>, config: ExcelConfig) {
    const headerRow = worksheet.addRow([
      ...this.makeSpaces(config.spaces),
      ...(columns || []).map(x => x.label)
    ]);

    if (config.colors) {
      headerRow.eachCell((cell, number) => {
        if (number > config.spaces) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: config.colors.fgColor },
            bgColor: { argb: config.colors.bgColor }
          };
          cell.font = {
            color: { argb: config.colors.fontColor || 'FFFFFF' },
            bold: true
          };
        }
      });
    }

    return worksheet;
  }

  /**
   *
   * @param worksheet - pass worksheet
   * @param config - pass ExcelConfig
   * @param columns - pass array of level
   * @param data - pass data item object
   * @returns returns worksheet object
   */
  makeData(worksheet, config: ExcelConfig, columns: Array<Level>, data) {
    let columnData = [];

    (columns || []).map(x => {
      columnData.push(data[x.key]);
    });

    worksheet.addRow([...this.makeSpaces(config.spaces), ...columnData]);

    return worksheet;
  }

  /**
   *
   * @param workbook - pass worksheet
   * @param filename - give filename
   */
  downoadExcel(workbook, filename: string) {
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      fs.saveAs(blob, `${filename}.xlsx`);
    });
  }
}

export interface TitleConfig {
  titleName: string;
  font?: Font;
  alignment?: Alignment;
  mergeCellAddress: string;
}
export interface Alignment {
  horizontal: string;
}
export interface Font {
  name?: string;
  family?: number;
  size?: number;
  bold?: boolean;
}
export interface ExcelConfig {
  spaces: number;
  colors?: ExcelColor;
}

export interface ExcelColor {
  fgColor: string;
  bgColor: string;
  fontColor: string;
}
export interface Level {
  key: string;
  label: string;
}

export interface ColumnWidth {
  columnNumber: number;
  width: number;
}
