import exportFromJSON from "export-from-json";

const ExportCSVFromJson = (data,fileName)=>{
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({
      data: data,
      fileName: fileName,
      exportType: exportType,
      withBOM: true,
    })
}

const ExportXLSFromJson = (data,fileName)=>{
    const exportType = exportFromJSON.types.xls;
    exportFromJSON({
      data: data,
      fileName: fileName,
      exportType: exportType,
      withBOM: true,
    })
}

export {ExportCSVFromJson, ExportXLSFromJson};