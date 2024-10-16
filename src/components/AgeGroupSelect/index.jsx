import React, { useState, useEffect } from "react";
import { Select, Form, Row, Col } from "antd";

const AgeGroupSelect = ({ onChange, isOverlap }) => {
  const [startAge, setStartAge] = useState(null);
  const [endAge, setEndAge] = useState(null);
  const maxAge = 20;

  useEffect(() => {
    if (startAge !== null && endAge !== null) {
      onChange(startAge, endAge);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAge, endAge]);

  // 產生選項列表，根據條件禁用不符合範圍的選項
  const generateOptions = (isStart) => {
    const options = [];
    for (let i = 0; i <= maxAge; i++) {
      let disabled = false;
      if (isStart) {
        if (endAge !== null && i > endAge) disabled = true;
      } else {
        if (startAge !== null && i < startAge) disabled = true;
      }
      options.push({
        value: i,
        label: i,
        disabled,
      });
    }
    return options;
  };

  return (
    <>
      <Form>
        <span>年齡</span>
        <Form.Item
          validateStatus={isOverlap ? "error" : ""}
          help={isOverlap ? "年齡區間不可重疊" : ""}
        >
          <Row gutter={8}>
            <Col span={11}>
              <Select
                size="large"
                width={"-webkit-fill-available"}
                value={startAge}
                placeholder="請選擇起始年齡"
                onChange={(value) => {
                  setStartAge(value);
                }}
                options={generateOptions(true)}
              ></Select>
            </Col>
            <Col span={2}>
              <label
                disabled={true}
                style={{
                  color: "black",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "-webkit-fill-available",
                  height: "100%",
                }}
              >
                ~
              </label>
            </Col>
            <Col span={11}>
              <Select
                width={"-webkit-fill-available"}
                size="large"
                value={endAge}
                placeholder="請選擇結束年齡"
                onChange={(value) => {
                  setEndAge(value);
                }}
                options={generateOptions(false)}
              ></Select>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default AgeGroupSelect;
