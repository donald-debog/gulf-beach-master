declare module '@editorjs/marker';
declare module '@editorjs/header';
declare module '@editorjs/list';
declare module '@editorjs/image';
declare module '@editorjs/code';
declare module '@editorjs/paragraph';
declare module '@editorjs/embed';
declare module '@editorjs/table';
declare module '@editorjs/inline-code';
declare module '@editorjs/quote';

declare module '@editorjs/marker' {
  import { BlockTool, BlockToolData } from '@editorjs/editorjs'
  export default class Marker implements BlockTool {
    static get toolbox(): { title: string; icon: string }
    constructor({ data }: { data: BlockToolData })
    render(): HTMLElement
    save(blockContent: HTMLElement): BlockToolData
    validate(data: BlockToolData): boolean
  }
}

declare module '@editorjs/header' {
  import { BlockTool, BlockToolData, BlockToolConstructorOptions } from '@editorjs/editorjs'
  
  interface HeaderConfig {
    placeholder?: string
    levels?: number[]
    defaultLevel?: number
  }

  interface HeaderData extends BlockToolData {
    text: string
    level: number
  }

  export default class Header implements BlockTool {
    static get toolbox(): { title: string; icon: string }
    constructor(options: BlockToolConstructorOptions<HeaderData, HeaderConfig>)
    render(): HTMLElement
    save(blockContent: HTMLElement): HeaderData
    validate(data: HeaderData): boolean
  }
}

declare module '@editorjs/list' {
  import { BlockTool, BlockToolData } from '@editorjs/editorjs'
  export default class List implements BlockTool {
    static get toolbox(): { title: string; icon: string }
    constructor({ data }: { data: BlockToolData })
    render(): HTMLElement
    save(blockContent: HTMLElement): BlockToolData
    validate(data: BlockToolData): boolean
  }
}

declare module '@editorjs/image' {
  import { BlockTool, BlockToolData } from '@editorjs/editorjs'
  export default class Image implements BlockTool {
    static get toolbox(): { title: string; icon: string }
    constructor({ data }: { data: BlockToolData })
    render(): HTMLElement
    save(blockContent: HTMLElement): BlockToolData
    validate(data: BlockToolData): boolean
  }
}

declare module '@editorjs/quote' {
  import { BlockTool, BlockToolData } from '@editorjs/editorjs'
  export default class Quote implements BlockTool {
    static get toolbox(): { title: string; icon: string }
    constructor({ data }: { data: BlockToolData })
    render(): HTMLElement
    save(blockContent: HTMLElement): BlockToolData
    validate(data: BlockToolData): boolean
  }
} 