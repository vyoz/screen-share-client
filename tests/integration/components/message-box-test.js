import { module, test } from 'qunit';
import { setupRenderingTest } from 'screen-share-client/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | message-box', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<MessageBox />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <MessageBox>
        template block text
      </MessageBox>
    `);

    assert.dom().hasText('template block text');
  });
});
