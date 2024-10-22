import { Input } from "antd";
import "./App.css";
import { useEffect, useState } from "react";
import AgeGroupSelect from "./components/AgeGroupSelect";
import PriceInput from "./components/PriceInput";
import AgeGroupPriceList from "./components/AgeGroupPriceList";

function App() {
  const [commaNumber, setCommaNumber] = useState();
  const [intervalNumber, setIntervalNumber] = useState();

  const handleAddComma = (e) => {
    if (!e.target.value) {
      setCommaNumber(0);
      return;
    }
    /**
     * \d 匹配一個數字。等價於[0-9]。
     * {n,m} 匹配前面的字符至少n次，最多m次。
     * (?<!y)x 當x前面不是y時，才匹配x。
     * x(?=y) 當x後面緊跟隨著y時，才匹配x。
     * + 匹配前面的表達式一次或者多次。等價於{1,}。
     * $ 匹配到字符串末尾。
     */
    const regex = /\d{1,3}(?=(\d{3})+$)/g;
    let stringValue = e.target.value.toString();
    let [integerPart, decimalPart] = parseFloat(stringValue)
      .toString()
      .split(".");
    // 對整數部分應用千分位逗號
    integerPart = integerPart.replace(regex, "$&,");
    // 如果有小數部分，拼接起來，否則只返回整數部分
    const commaValue = decimalPart
      ? `${integerPart}.${decimalPart}`
      : integerPart;

    setCommaNumber(commaValue);
  };

  const handleGetNumberIntervals = (e) => {
    const value = e?.target?.value || e;
    let ranges = JSON.parse(value);

    // 將區間按起點排序
    ranges.sort((a, b) => a[0] - b[0]);

    let merged = []; // 合併區間主要是用來在最後找尋未包含的區間
    let overlap = []; // 重疊區間
    let notInclude = []; // 未包含區間

    let current = ranges[0];

    for (let i = 1; i < ranges.length; i++) {
      let next = ranges[i];

      // 檢查當前區間與下一個區間是否有重疊
      if (current[1] >= next[0]) {
        // 找到重疊部分，這裡避免完全包含情況
        let overlapStart = Math.max(current[0], next[0]);
        let overlapEnd = Math.min(current[1], next[1]);

        //排除完全包含在區間內的情況，就不重複push進去，Ex: [7,7]
        if (
          overlapEnd >= overlapStart &&
          !overlap.some((o) => o[0] <= overlapStart && o[1] >= overlapEnd)
        ) {
          overlap.push([overlapStart, overlapEnd]);
        }

        // 合併區間
        current = [current[0], Math.max(current[1], next[1])];
      } else {
        // 不重疊的情況，保存當前的合併區間
        merged.push(current);
        current = next;
      }
    }
    // 添加最後一個區間
    merged.push(current); //ex: [[6,11],[14,20]]

    // 找出未包含的區間
    let start = 0;
    for (let range of merged) {
      if (start < range[0]) {
        notInclude.push([start, range[0] - 1]);
      }
      start = range[1] + 1;
    }
    if (start <= 20) {
      notInclude.push([start, 20]);
    }

    setIntervalNumber({ overlap, notInclude });
  };

  useEffect(() => {
    handleGetNumberIntervals("[[6, 11], [5, 8], [17, 20], [7, 7], [14,17]]");
  }, []);

  return (
    <div className="App">
      <fieldset>
        <legend>addComma</legend>
        <Input
          size="large"
          style={{ width: "50%" }}
          placeholder="Basic usage"
          onChange={handleAddComma}
        />
        <p>{commaNumber}</p>
      </fieldset>

      <fieldset>
        <legend>getNumberIntervals</legend>
        <Input
          size="large"
          style={{ width: "50%" }}
          placeholder="Basic usage"
          onChange={handleGetNumberIntervals}
          defaultValue={"[[6, 11], [5, 8], [17, 20], [7, 7], [14,17]]"}
        />
        <p>{JSON.stringify(intervalNumber)}</p>
      </fieldset>

      <fieldset>
        <legend>PriceInput</legend>
        <PriceInput onChange={(result) => console.log(result)} />
      </fieldset>

      <fieldset>
        <legend>AgeGroupSelect</legend>
        <AgeGroupSelect
          onChange={(starAge, endAge) => console.log([starAge, endAge])}
        />
      </fieldset>

      <fieldset>
        <legend>AgeGroupPriceList UI</legend>
        <AgeGroupPriceList onChange={(result) => console.log(result)} />
      </fieldset>
    </div>
  );
}

export default App;
