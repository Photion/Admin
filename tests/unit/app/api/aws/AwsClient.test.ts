
import sinon from 'sinon';

import '~/tests/setup';
import { getAwsClient } from '~/tests/utils/aws';


describe('unit.app.api.aws.AwsClient', () => {
  afterEach(() => sinon.restore());

  describe('.constructor', () => {
    it('Creates a Fragment', () => {
      const { client } = getAwsClient();
      expect(client.constructor.name).toEqual('AwsClient');
    });
  });
});
