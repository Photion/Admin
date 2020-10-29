import * as fs from 'fs';

import { Namespace } from '~/src/models/Model';
import { FileStorage, FileMetadata } from '~/src/files/metadata';
import { getAwsClient } from '~/tests/utils/aws';

interface DataRef {
  namespace: Namespace;
  uuid: string;
}

interface FileRef extends DataRef {
  metadata: FileMetadata;
}

interface TestContext {
  refs: DataRef[];
  files: FileRef[];
}

describe('feat.api.aws', () => {
  const context: TestContext = {
    refs: [],
    files: [],
  };

  afterEach(async () => {
    const { client } = getAwsClient();

    await Promise.all(
      context.refs.map((ref: DataRef) => client.remove(ref.namespace, ref.uuid)),
    );

    await Promise.all(
      context.files.map((ref: FileRef) => client.deleteFile(ref.namespace, ref.uuid, ref.metadata)),
    );

    context.refs = [];
    context.files = [];
  });

  describe('Handles queries', () => {
    it('Lists an empty table', async () => {
      const namespace = Namespace.Project;
      const { client } = getAwsClient();

      const items = await client.list(namespace);

      expect(items).toEqual([]);
    });

    it('Returns null when the item is not found', async () => {
      const namespace = Namespace.Project;
      const uuid = 'fake-uuid';
      const { client } = getAwsClient();

      const item = await client.retrieve(namespace, uuid);

      expect(item).toEqual(null);
    });

    it('Creates and retrieves a project', async () => {
      const namespace = Namespace.Project;
      const project = {
        uuid: 'uuid1',
        name: 'Project 1',
        description: 'Description',
        portfolio: true,
      };

      context.refs.push({ namespace, uuid: project.uuid });

      const { client } = getAwsClient();
      await client.create(namespace, project);

      const item = await client.retrieve(namespace, project.uuid);

      expect(item).toEqual(project);
    });

    it('Updates an existing entry', async () => {
      const namespace = Namespace.Project;
      const project = {
        uuid: 'uuid1',
        name: 'Project 1',
        description: 'Description',
        portfolio: false,
      };
      const updated = {
        ...project,
        description: 'New Description',
      };

      context.refs.push({ namespace, uuid: project.uuid });

      const { client } = getAwsClient();

      await client.create(namespace, project);
      await client.update(namespace, project.uuid, updated);

      const item = await client.retrieve(namespace, project.uuid);

      expect(item).toEqual(updated);
    });


    it('Deletes an entry', async () => {
      const namespace = Namespace.Project;
      const project = {
        uuid: 'uuid1',
        name: 'Project 1',
        description: 'Description',
        portfolio: true,
      };

      context.refs.push({ namespace, uuid: project.uuid });

      const { client } = getAwsClient();
      await client.create(namespace, project);
      await client.remove(namespace, project.uuid);

      const item = await client.retrieve(namespace, project.uuid);

      expect(item).toEqual(null);
    });
  });

  describe('Handles files.', () => {
    const file = fs.readFileSync(__filename);

    it('Uploads the file', async () => {
      const namespace = Namespace.Medium;
      const uuid = 'uuid1';
      const metadata = {
        filename: 'filename',
        size: 1024,
        mime: 'application/javascript',
        storage: FileStorage.PREVIEW,
        public: false,
        date: '',
        tags: {},
      };

      const { client } = getAwsClient();
      context.files.push({ namespace, uuid, metadata });

      await client.uploadFile(namespace, uuid, metadata, file);
      await client.headFile(namespace, uuid, metadata);
    });
  });
});
