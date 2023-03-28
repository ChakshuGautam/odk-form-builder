import * as XLSX from 'xlsx/xlsx';


// enum RowHeaderIndices {
//   type = 0,
//   name = 1,
//   label = 2,
//   required = 3,
//   calculation = 4,
//   constraint = 5,
//   constraint_message = 6,
//   relevant = 7,
//   apperance = 8
// };

const rows = [['type', 'name', 'label', 'required', 'calculation', 'constraint', 'constraint_message', 'relevant', 'apperance']];
const choicesRows = [['list_name', 'name', 'label']];


const handleCardProperties = (formProperty: any, key: string) => {
  // console.log('formProperty: ', formProperty);
  console.log('formProperty["x-component"]: ', formProperty['x-component'])
  switch (formProperty['x-component'].trim()) {
    case 'Card':
      rows.push(['begin_group', formProperty["x-designable-id"], key]) // pushed key because key is the same as name, and name is not guranteed but key is
      for (const key in formProperty.properties) {
        handleCardProperties(formProperty.properties[key], key);
      }
      rows.push(["end_group"])
      break;
    case 'Select':
      // create choices first
      (formProperty["enum"] as any[]).forEach((choice: any) => choicesRows.push([formProperty["x-designable-id"] + "_choices", choice["label"], choice["value"]])
      )

      // now create survey ws row
      console.log('formProperty["x-component-props"]?.mode: ', formProperty['x-component-props']?.mode)
      rows.push(['select_' + (formProperty['x-component-props']?.mode !== undefined ? formProperty['x-component-props']?.mode : 'single') + ' ' + formProperty["x-designable-id"] + "_choices", formProperty["x-designable-id"], formProperty["description"], formProperty["required"] ? "yes" : "no"])
      break;
    case 'Text':
      rows.push(['note', formProperty["x-designable-id"], formProperty["description"] ?? formProperty["name"], formProperty["required"] ? "yes" : "no"])
      break;
    case 'Input':
      rows.push([(formProperty["x-validator"].length > 0 ? formProperty["x-validator"] : 'text'), formProperty["x-designable-id"], (formProperty["description"] ? formProperty["description"] : formProperty["name"]), formProperty["required"] ? "yes" : "no"])
      break;
    case 'DatePicker':
      rows.push(['date', formProperty["x-designable-id"], formProperty["description"] ?? formProperty["name"], formProperty["required"] ? "yes" : "no"])

  }
}


export const jsonToXLSX = (json: any) => {
  const wb = XLSX.utils.book_new();

  const formProperties: any[] = json.schema.properties as any[];
  for (const key in formProperties)
    handleCardProperties(formProperties[key], key);

  console.log('rows: ', rows);
  console.log('choicesRows: ', choicesRows);

  // create the sheet and write it to 
  const survey = XLSX.utils.aoa_to_sheet(rows);
  const choices = XLSX.utils.aoa_to_sheet(choicesRows);
  XLSX.utils.book_append_sheet(wb, survey, 'survey');
  XLSX.utils.book_append_sheet(wb, choices, 'choices');
  XLSX.writeFile(wb, `test-${Date.now()}.xlsx`);
}