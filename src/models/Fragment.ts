import { modelize, ModelProps } from '~/src/models/Model';
import { FileMetadata, FileStorage, readFile, isSupportedMime } from '~/src/files/metadata';


export interface FragmentProps extends ModelProps {
  concept: string;
  meta?: FileMetadata;
  notes?: string;
}

export interface Fragment extends Required<FragmentProps> {}

const namespace = 'fragments';
const fields: Array<keyof FragmentProps> = ['uuid', 'concept', 'meta', 'notes'];

export class Fragment extends modelize<FragmentProps>(namespace, fields) {
  data: string = '';
  file: File | null = null;

  constructor(props: FragmentProps) {
    super(props);
    this.concept = props.concept;
    this.meta = props.meta ?? { filename: '', mime: '', size: 0, storage: FileStorage.PREVIEW, public: false, date: null, tags: null };
    this.notes = props.notes ?? '';
  }

  getFileReader() {
    return new FileReader();
  }

  async setFile(file: File) {
    const { preview, date, tags } = await readFile(file);

    this.file = file;

    this.meta.filename = file.name;
    this.meta.size = file.size;
    this.meta.mime = file.type;
    this.meta.tags = tags;
    this.meta.date = date;

    this.data = preview;
    return this.data;
  }

  get name() {
    const fragments = this.meta.filename.split('.');
    fragments.pop();

    return fragments.join('.');
  }

  get hasPreview() {
    return isSupportedMime(this.meta.mime);
  }

  get url() {
    if (this.meta.storage !== FileStorage.PREVIEW) {
      return null;
    }

    if (this.data) {
      return this.data;
    }

    return this.client.getFileUrl(namespace, this.uuid, this.meta);
  }

  async upload(file: File | null = null) {
    const content = file || this.file;

    if (!content) {
      throw new Error('Either `file` or `this.file` must be a File.');
    }

    // save for the latest metadata
    await this.save();

    await this.client.uploadFile(namespace, this.uuid, this.meta, content);
  }

  async remove() {
    await this.client.deleteFile(namespace, this.uuid, this.meta);

    return super.remove();
  }
}
