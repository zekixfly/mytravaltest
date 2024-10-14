import React, { useEffect } from "react";
import { Form, InputNumber } from "antd";

const PriceInput = ({ onChange }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.validateFields();
  }, [form]);
  return (
    <>
      <Form
        form={form}
        name="demoForm"
        style={{ width: "fit-content" }}
        onFinish={(values) => console.log("Sucess:", values)}
        onFinishFailed={(errorInfo) => console.log("Failed:", errorInfo)}
      >
        <Form.Item>
          <span>入住費用(每人每晚)</span>
          <Form.Item
            name="price"
            rules={[
              {
                required: true,
                message: "不可以為空白",
              },
            ]}
          >
            <InputNumber
              addonBefore={"TWD"}
              size="large"
              min={0}
              placeholder="請輸入費用"
              formatter={(value) => {
                let [integerPart, decimalPart] = `${value}`.split(".");
                integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return decimalPart
                  ? `${integerPart}.${decimalPart}`
                  : integerPart;
              }}
              onChange={(value) => onChange(value)}
            />
          </Form.Item>
          <span style={{ float: "right" }}>輸入0表示免費</span>
        </Form.Item>
      </Form>
    </>
  );
};

export default PriceInput;
