'use strict';

// Built using the 'marked' library for interpretation

// Seanr707 2016/07/21 10:00am

var Input = React.createClass({
  displayName: 'Input',

  getInitialState: function getInitialState() {
    // Sample to be inserted to textarea on load
    var sample = ['# Heading \n\n ### Smaller heading \n\n', 'One line space to begin new ~~paragraf~~ paragraph\n\n', '**Be bold**, not *slanted*\n\n', '`Monospace is always good face`\n\n', '    Four spaces each\n    line to have some\n    // code'];
    return { value: sample.join('') };
  },

  // Updates virtualDOM when real DOM is altered
  handleChange: function handleChange(event) {
    this.setState({ value: event.target.value });
  },

  // Clears textarea and virtualDOM
  handleClear: function handleClear() {
    console.log('Clearing...');
    this.setState({ value: '' });

    // Clears Upload input as well
    // Will console error if Browser (IE8/9) doesn't support value change
    try {
      document.getElementById('upload').value = '';
    } catch (err) {
      console.log(err + '\nTry site on a newer browser');
    }
  },

  // Reads textfile or .md from local PC and copies to textarea
  handleFile: function handleFile(event) {
    var file = event.target.files;
    var reader = new FileReader();

    console.log(file);
    console.log(file[0]);

    var self = this;

    // Async function which loads text into textarea once textFromFile is started
    reader.onload = function (theFile) {
      return function (e) {
        console.log('Loaded txt!');
        self.setState({ value: e.target.result });
      };
    }(file);

    reader.readAsText(file[0]);
  },

  // Delegates button click to 'file-input' field (which is hidden due to being... ugly)
  handleUpload: function handleUpload(event) {
    var upload = function upload() {
      // find input
      var input = document.getElementById('upload');

      // create fake click on DOM
      if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        input.dispatchEvent(event);
      } else {
        input.click();
      }
    };

    upload();
  },

  render: function render() {
    var width = 'col-md-4 col-sm-4';
    var sideWidth = 'col-md-2 small-hide';
    var buttonWidth = 'col-md-1 col-sm-2 col-xs-3';

    return React.createElement(
      'div',
      { className: 'container' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement('span', { className: sideWidth }),
        React.createElement(
          'div',
          { id: 'input-text', className: width },
          React.createElement('textarea', {
            id: 'text-input',
            type: 'text',
            className: 'form-control',
            onChange: this.handleChange,
            value: this.state.value
          })
        ),
        React.createElement(Output, { colWidth: width, textData: this.state.value }),
        React.createElement('span', { className: sideWidth })
      ),
      React.createElement(
        'nav',
        { className: 'navbar navbar-default navbar-fixed-bottom nav-bottom' },
        React.createElement(
          'div',
          { className: 'container-fluid' },
          React.createElement(
            'div',
            { className: 'bottom-buttons-container' },
            React.createElement(
              'div',
              { className: 'button-container' },
              React.createElement(
                'button',
                { className: 'btn btn-danger', onClick: this.handleClear },
                'Clear'
              )
            ),
            React.createElement(
              'div',
              { className: 'button-container' },
              React.createElement(SaveFile, { textData: this.state.value })
            ),
            React.createElement(
              'div',
              { className: 'button-container' },
              React.createElement(
                'button',
                { className: 'btn btn-default', onClick: this.handleUpload },
                'Upload'
              ),
              React.createElement('input', {
                id: 'upload',
                type: 'file',
                accept: '.txt, .md',
                enctype: 'text/plain',
                onChange: this.handleFile,
                className: 'upload'
              })
            )
          )
        )
      )
    );
  }
});

var Output = React.createClass({
  displayName: 'Output',

  render: function render() {

    // Wrapped in function to attempt to make injection of HTML safer
    var markdown = function markdown(text) {
      return { __html: marked(text, { sanitize: true }) };
    };

    return React.createElement(
      'div',
      { id: 'interpretted-text', className: this.props.colWidth },
      React.createElement('p', {
        className: 'responsiveWidth',
        dangerouslySetInnerHTML: markdown(this.props.textData)
      })
    );
  }
});

var SaveFile = React.createClass({
  displayName: 'SaveFile',

  handleClick: function handleClick(event) {

    // Returns null if no text in field
    if (!this.props.textData) {
      return undefined;
    }

    var download = function download(filename, text) {
      var pom = document.createElement('a');
      pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      pom.setAttribute('download', filename);

      if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
      } else {
        pom.click();
      }
    };

    download('markdown-preview.md', this.props.textData);
  },

  render: function render() {
    return React.createElement(
      'button',
      { onClick: this.handleClick, className: 'btn btn-primary' },
      'Export'
    );
  }
});

ReactDOM.render(React.createElement(Input, null), document.getElementById('editor'));