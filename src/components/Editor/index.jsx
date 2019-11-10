import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: null,
    };
  }

  componentDidMount() {
    this.initValue();
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value) {
      this.initValue(value);
    }
  }

  initValue = tempValue => {
    const { value } = this.props;
    const { editorState } = this.state;
    if ((value || tempValue) && !editorState) {
      this.setState({
        editorState: BraftEditor.createEditorState(value || tempValue),
      });
    }
  };

  submitContent = () => {
    const { onChange } = this.props;
    const { editorState } = this.state;
    const htmlContent = editorState && editorState.toHTML();
    onChange && onChange(htmlContent);
  };

  handleEditorChange = editorState => {
    this.setState({ editorState });
    this.submitContent();
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="my-component">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          onSave={this.submitContent}
        />
      </div>
    );
  }
}

export default Editor;
