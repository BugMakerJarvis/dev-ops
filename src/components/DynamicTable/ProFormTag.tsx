import {PureComponent} from 'react';
import {Tag, Input, Tooltip, Space} from 'antd';
import {PlusOutlined, TagOutlined} from '@ant-design/icons';
import {getIntl, getLocale} from "@@/plugin-locale/localeExports";

type ProFormTagProps = {
  value?: string,
  onChange?: (value: string) => void
}

const {messages} = getIntl(getLocale());

class ProFormTag extends PureComponent<ProFormTagProps, {
  tags: string[],
  inputVisible: boolean,
  inputValue: string,
  editInputIndex: number,
  editInputValue: string,
}> {

  input: any = undefined;
  editInput: any = undefined;

  constructor(props: any) {
    super(props);

    this.state = {
      tags: props.value !== undefined ? (typeof props.value === 'string' ? JSON.parse(props.value) : props.value) : [],
      inputVisible: false,
      inputValue: '',
      editInputIndex: -1,
      editInputValue: ''
    }
  }

  handleClose = (removedTag: any) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    const {onChange} = this.props;
    console.log("tags after delete:" + tags);
    this.setState({tags}, () => {
      onChange!(JSON.stringify(tags));
    });
  };

  showInput = () => {
    this.setState({inputVisible: true}, () => this.input.focus());
  };

  handleInputChange = (e: any) => {
    this.setState({inputValue: e.target.value});
  };

  handleInputConfirm = () => {
    const {inputValue} = this.state;
    const {onChange} = this.props;
    let {tags} = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    console.log("tags after add:" + tags);
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    }, () => {
      onChange!(JSON.stringify(tags));
    });
  };

  handleEditInputChange = (e: any) => {
    this.setState({editInputValue: e.target.value});
  };

  handleEditInputConfirm = () => {
    this.setState(({tags, editInputIndex, editInputValue}) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      return {
        tags: newTags,
        editInputIndex: -1,
        editInputValue: '',
      };
    });
  };

  saveInputRef = (input: any) => {
    this.input = input;
  };

  saveEditInputRef = (input: any) => {
    this.editInput = input;
  };

  render() {
    const {tags, inputVisible, inputValue, editInputIndex, editInputValue} = this.state;
    return (
      <Space size={[8, 12]} wrap>
        {tags && tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag}
              closable={true}
              icon={<TagOutlined/>}
              color="blue"
              onClose={() => this.handleClose(tag)}
            >
                            <span>
                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                            </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            className="tag-input"
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput} color="blue">
            <PlusOutlined/> {messages['pages.dynamicTable.record.tag.add']}
          </Tag>
        )}
      </Space>
    )
  }
}

export default ProFormTag;
