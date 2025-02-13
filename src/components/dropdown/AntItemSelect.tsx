import { Form, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import React from "react";

interface IAntSelect {
  name?: string;
  labelName?: string;
  value?: any;
  option?: DefaultOptionType[];
  require?: boolean;
  mode?: "multiple" | "tags";
  onChange?: (e: DefaultOptionType) => void;
}

export default function AntItemSelect(props: IAntSelect) {
  const { require, name, value, option, mode, onChange, labelName } = props;
  return (
    <div>
      <label className="text-sm font-bold">{labelName}</label>
      <Form.Item
        rules={[
          {
            required: require !== undefined,
            message: `Please input ${labelName}!`,
          },
        ]}
        // hasFeedback
        name={name}
      >
        <Select
          value={value}
          mode={mode && mode}
          showSearch
          size="middle"
          style={{ width: "100%" }}
          placeholder={`Pilih ${labelName}`}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label as string)
              .toLowerCase()
              .localeCompare((optionB?.label as string).toLowerCase())
          }
          options={option}
          onChange={onChange}
          variant="borderless"
          className={` active:bg-white border min-h-9 focus:bg-white hover:bg-white bg-white rounded-lg drop-shadow-sm`}
        />
      </Form.Item>
    </div>
  );
}
