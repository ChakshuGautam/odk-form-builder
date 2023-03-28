import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';


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


// const getCardPropertiesAsArr = (card: any): string[] => {
//   const rows = [];
//   const cardProp = card?.properties;
//   for (const key in cardProp) {

//   }

//   return [];
// };

const handleCardProperties = (formProperty: any, key: string) => {
  switch (formProperty['x-component']) {
    case 'Card':
      rows.push(['begin_group', formProperty["x-designable-id"], key]) // pushed key because key is the same as name, and name is not guranteed but key is
      for (const key in formProperty.properties) {
        handleCardProperties(formProperty.properties, key);
      }
      rows.push(["end_group"])
      break;
    case 'Select':
      // create choices first
      (formProperty["enum"] as any[]).forEach((choice: any) => choicesRows.push([formProperty["x-designable-id"] + "_choices", choice["label"], choice["value"]])
      )

      // now create survey ws row
      rows.push(['select_' + formProperty['x-component-props']?.mode ?? 'single' + ' ' + formProperty["x-designable-id"] + "_choices", formProperty["x-designable-id"], formProperty["description"], formProperty["required"] ? "yes" : "no"])
      break;
    case 'Text':
      rows.push(['note', formProperty["x-designable-id"], formProperty["description"] ?? formProperty["name"], formProperty["required"] ? "yes" : "no"])
      break;
    case 'Input':
      rows.push([formProperty["x-validator"] ?? 'text', formProperty["x-designable-id"], formProperty["description"] ?? formProperty["name"], formProperty["required"] ? "yes" : "no"])
      break;
    case 'DatePicker':
      rows.push(['date', formProperty["x-designable-id"], formProperty["description"] ?? formProperty["name"], formProperty["required"] ? "yes" : "no"])

    // return XLSX.utils.aoa_to_sheet(rows);
  }
}


const jsonToXLSX = (json: any) => {
  const wb = XLSX.utils.book_new();

  const formProperties: any[] = json.schema.properties as any[];
  for (const key in formProperties)
    handleCardProperties(formProperties[key], key);

  // create the sheet and write it to 
  const survey = XLSX.utils.aoa_to_sheet(rows);
  const choices = XLSX.utils.aoa_to_sheet(choicesRows);
  XLSX.utils.book_append_sheet(wb, survey, 'survey');
  XLSX.utils.book_append_sheet(wb, choices, 'choices');
  XLSX.writeFile(wb, 'test.xlsx');
}

jsonToXLSX({
  "form": {
    "labelCol": 6,
    "wrapperCol": 12
  },
  "schema": {
    "type": "object",
    "properties": {
      "selection_of_request": {
        "type": "void",
        "x-component": "Card",
        "x-component-props": {
          "title": "Preferences"
        },
        "x-designable-id": "xfwvvm8hkp9",
        "x-index": 0,
        "name": "selection_of_request",
        "properties": {
          "preferences": {
            "title": "Preferences",
            "x-decorator": "FormItem",
            "x-component": "Select",
            "x-validator": [],
            "x-component-props": {},
            "x-decorator-props": {},
            "name": "preferences",
            "description": "Please select the number corresponding to the option you want to proceed ahead with.\n",
            "required": true,
            "enum": [
              {
                "children": [],
                "label": "1 Leave Balance",
                "value": "Item 1"
              },
              {
                "children": [],
                "value": "Item 2",
                "label": "2 Leave Application"
              },
              {
                "children": [],
                "value": "Item 3",
                "label": "3 Org Resources"
              }
            ],
            "x-designable-id": "7ngxpyfcypq",
            "x-index": 0
          }
        }
      },
      "eof_leave_balance_note": {
        "type": "void",
        "x-component": "Card",
        "x-component-props": {
          "title": "Leave Balance Group"
        },
        "x-designable-id": "qfnu3o4f0y1",
        "x-index": 1,
        "name": "eof_leave_balance_note",
        "properties": {
          "Your current leave balance in this financial year is 10": {
            "type": "string",
            "x-component": "Text",
            "x-component-props": {},
            "x-designable-id": "ab9q4hk6kv2",
            "x-index": 0,
            "name": "Your current leave balance in this financial year is 10"
          }
        }
      },
      "leave_app": {
        "type": "void",
        "x-component": "Card",
        "x-component-props": {
          "title": "Title"
        },
        "name": "leave_app",
        "x-designable-id": "t4l203kducs",
        "x-index": 2,
        "properties": {
          "type_of_leave": {
            "title": "Select type of leave",
            "x-decorator": "FormItem",
            "x-component": "Select",
            "x-validator": [],
            "x-component-props": {
              "mode": "multiple"
            },
            "x-decorator-props": {},
            "x-designable-id": "3g4fjuhs8fp",
            "x-index": 0,
            "name": "type_of_leave",
            "description": "Please select the type of leave you want to opt for",
            "enum": [
              {
                "children": [],
                "value": "Item 1",
                "label": "1 Planned"
              },
              {
                "children": [],
                "value": "Item 2",
                "label": "2 Emergency"
              },
              {
                "children": [],
                "value": "Item 3",
                "label": "3 Maternity"
              },
              {
                "children": [],
                "value": "Item 4",
                "label": "4 Paternity"
              },
              {
                "children": [],
                "value": "Item 5",
                "label": "5 Wedding"
              },
              {
                "children": [],
                "value": "Item 6",
                "label": "6 Sabbatical"
              }
            ]
          },
          "reason": {
            "type": "string",
            "title": "Tell us the reason for your leave",
            "x-decorator": "FormItem",
            "x-component": "Input",
            "x-validator": [],
            "x-component-props": {},
            "x-decorator-props": {},
            "name": "reason",
            "description": "",
            "x-designable-id": "s3vs4n5y8ut",
            "x-index": 1
          },
          "start_date_leave": {
            "type": "string",
            "title": "Start Date",
            "x-decorator": "FormItem",
            "x-component": "DatePicker",
            "x-validator": [],
            "x-component-props": {},
            "x-decorator-props": {},
            "name": "start_date_leave",
            "description": "Select the start date for leave",
            "x-designable-id": "bv0ztwy3u9e",
            "x-index": 2
          },
          "end_date_leave": {
            "type": "string",
            "title": "End Date",
            "x-decorator": "FormItem",
            "x-component": "DatePicker",
            "x-validator": [],
            "x-component-props": {},
            "x-decorator-props": {},
            "name": "end_date_leave",
            "x-designable-id": "s13c33fj8kt",
            "x-index": 3
          },
          "number_of_working_days": {
            "type": "string",
            "title": "Please enter the number of working days",
            "x-decorator": "FormItem",
            "x-component": "Input",
            "x-validator": "integer",
            "x-component-props": {},
            "x-decorator-props": {},
            "name": "number_of_working_days",
            "x-designable-id": "og62q6xpefy",
            "x-index": 4
          }
        }
      }
    },
    "x-designable-id": "u96tpwaaovc"
  }
}
)