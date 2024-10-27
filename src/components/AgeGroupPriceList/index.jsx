import React, { Fragment, useState, useEffect } from "react";
import { Button, Divider } from "antd";
import { v4 as uuidv4 } from "uuid";
import PriceInput from "../PriceInput";
import AgeGroupSelect from "../AgeGroupSelect";

const handleGetNumberIntervals = (priceList) => {
  let clonePriceList = [...priceList];
  clonePriceList.sort((a, b) => a.ageGroup[0] - b.ageGroup[0]);

  let overlappingIds = [];

  for (let i = 0; i < clonePriceList.length - 1; i++) {
    let current = clonePriceList[i];
    for (let j = i + 1; j < clonePriceList.length; j++) {
      let next = clonePriceList[j];
      // 如果區間重疊
      if (current.ageGroup[1] >= next.ageGroup[0]) {
        if (!overlappingIds.includes(current.id)) {
          overlappingIds.push(current.id);
        }
        if (!overlappingIds.includes(next.id)) {
          overlappingIds.push(next.id);
        }
      }
    }
  }

  return overlappingIds;
};

const AgeGroupPriceList = ({ onChange }) => {
  const [priceList, setPriceList] = useState([
    { id: uuidv4(), ageGroup: [null, null], price: null },
  ]);
  const [overlappingIds, setOverlappingIds] = useState([]);

  // 每次 priceList 改變時檢查重疊區間
  useEffect(() => {
    const overlaps = handleGetNumberIntervals(priceList);
    setOverlappingIds(overlaps);
  }, [priceList]);

  const updatePriceList = (priceList) => {
    setPriceList(priceList);
    onChange(priceList);
  };

  // 當年齡範圍改變時更新
  const handleAgeGroupChange = (id, startAge, endAge) => {
    const newPriceList = [...priceList];
    newPriceList.find((item) => item.id === id).ageGroup = [startAge, endAge];
    updatePriceList(newPriceList);
  };

  // 當價格改變時更新
  const handlePriceChange = (id, newPrice) => {
    priceList.find((item) => item.id === id).price = newPrice;
    updatePriceList(priceList);
  };

  // 新增一個價格設定
  const addPriceSetting = () => {
    setPriceList([
      ...priceList,
      { id: uuidv4(), ageGroup: [null, null], price: null },
    ]);
  };

  // 移除一個價格設定
  const removePriceSetting = (id) => {
    const newPriceList = priceList.filter((item) => item.id !== id);
    updatePriceList(newPriceList);
  };

  return (
    <div>
      {priceList.map((item, index) => (
        <Fragment key={item.id}>
          <span>價格設定 - {index}</span>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            <div style={{ width: "45%" }}>
              <AgeGroupSelect
                onChange={(startAge, endAge) =>
                  handleAgeGroupChange(item.id, startAge, endAge)
                }
                isOverlap={overlappingIds.includes(item.id)} // 傳遞錯誤狀態
              />
            </div>
            <div style={{ marginLeft: "20px" }}>
              <PriceInput
                onChange={(newPrice) => handlePriceChange(item.id, newPrice)}
              />
            </div>
            <Button
              type="danger"
              onClick={() => removePriceSetting(item.id)}
              style={{ marginLeft: "20px" }}
            >
              移除
            </Button>
          </div>
        </Fragment>
      ))}
      <Divider />
      <Button type="primary" onClick={addPriceSetting}>
        新增價格設定
      </Button>
    </div>
  );
};
export default AgeGroupPriceList;
