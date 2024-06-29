import { module, test } from 'qunit';
import { setupRenderingTest } from 'screen-share-client/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | disconnect-button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<DisconnectButton />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <DisconnectButton>
        template block text
      </DisconnectButton>
    `);

    assert.dom().hasText('template block text');
  });
});
