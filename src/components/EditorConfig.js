import EditorJS from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';

const editor = new EditorJS({
  tools: {
    image: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: '/api/upload', // Your API route for file uploads
          byUrl: '/api/fetchUrl', // If you have a URL fetch endpoint
        },
      },
    },
  },
});

export default editor; 