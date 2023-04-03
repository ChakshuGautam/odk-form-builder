import { useState } from 'react'
import './App.css'
import Editor from "@monaco-editor/react";

import {playgrondUtility} from '../../../packages/form-transpiler/src/index'
import * as FileSaver from 'file-saver';

function App() {
  const [excelJSON, setExcelJSON] = useState<any>(null)
  const [code, setCode] = useState("");

  const onCodeChange = (code: any) => {
    try {
      // const parsedCode = JSON.parse(code);
      setCode(code);
    } catch (err) {
      console.log(err);
    }
  }

  const monacoEditorOptions = {
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
  };
  
  return (
    <div className="App">
      <div>
        <h2> Enter Formilly JSON here </h2>
      <Editor
          language= {"json"}
          value={code}
          theme="vs-light"
          onChange={onCodeChange}
          height={400}
          options={monacoEditorOptions}
        />
      </div>
      <div className="card">
        <button onClick={() => {
          const xlsxJson = playgrondUtility(JSON.parse(code));
          console.log('code: ', xlsxJson);
          setExcelJSON(xlsxJson);
        }}>
          Generate XLSX
        </button>
        <button onClick={() => {
          const xlsxJson = playgrondUtility(JSON.parse(code));
          console.log('code: ', xlsxJson);
          const data = new Blob([xlsxJson["excelBuffer"]], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'});
          FileSaver.saveAs(data, `${Date.now()}.xlsx`);
        }}>
          Download XLSX
        </button>
      </div>
      <h1> Corresponding XLSX is: </h1>
        
        {excelJSON && excelJSON["survey"] && 
        <> <h4> Survey Sheet </h4> 
        <table>
          <thead>
            {/* {Object.keys(excelJSON['survey'][0]).map(key => <th> {key} </th>)} */}
            <th> type </th>
            <th> name </th>
            <th> label </th>
            <th> required </th>
          </thead>  
          <tbody>
            {excelJSON['survey'].map((row: any) => {
              return (
                <tr>
                {Object.keys(row).map(key => <td> {row[key]} </td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
        </>
        }
        {excelJSON && excelJSON["choices"] && 
        <> 
        <h4> Choices sheet </h4>
         
        <table>
          <thead>
            {Object.keys(excelJSON['choices'][0]).map(key => <th> {key} </th>)}
            
          </thead>  
          <tbody>
            {excelJSON['choices'].map((row: any) => {
              return (
                <tr>
                {Object.keys(row).map(key => <td> {row[key]} </td>)}
                </tr>
              )
            })}
          </tbody>
        </table>
        </>
        }
    </div>
  )
}


export default App;
