import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichArticleEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered'}, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
      ['table'],
      ['code-block']
    ],
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

export default RichArticleEditor;