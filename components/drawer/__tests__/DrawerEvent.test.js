import React from 'react';
import Drawer from '..';

import { render, fireEvent, screen } from '../../../tests/utils';

describe('Drawer', () => {
  const getDrawer = props => (
    <Drawer visible getContainer={false} {...props}>
      Here is content of Drawer
    </Drawer>
  );

  it('render correctly', () => {
    const { container, asFragment, rerender } = render(getDrawer());
    expect(container.querySelector('.ant-drawer-body')).toBeTruthy();

    rerender(getDrawer({ visible: false }));

    expect(container.querySelector('.ant-drawer-body').textContent).toEqual(
      'Here is content of Drawer',
    );

    expect(asFragment().firstChild).toMatchSnapshot();
  });

  it('mask trigger onClose', () => {
    const onClose = jest.fn();
    const { container } = render(getDrawer({ onClose }));

    fireEvent.click(container.querySelector('.ant-drawer-mask'));
    expect(onClose).toHaveBeenCalled();
  });

  it('close button trigger onClose', () => {
    const onClose = jest.fn();
    const { container } = render(getDrawer({ onClose }));

    fireEvent.click(container.querySelector('.ant-drawer-close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('maskClosable no trigger onClose', () => {
    const onClose = jest.fn();
    const { container } = render(getDrawer({ onClose, maskClosable: false }));

    fireEvent.click(container.querySelector('.ant-drawer-mask'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('dom should be removed after close when destroyOnClose is true', () => {
    const { rerender, container } = render(getDrawer({ destroyOnClose: true }));
    rerender(getDrawer({ destroyOnClose: true, visible: false }));
    const ev = new Event('transitionend', { bubbles: true });
    ev.propertyName = 'transform';
    fireEvent(container.querySelector('.ant-drawer-content-wrapper'), ev);
    expect(screen.queryByText(/Here is content of Drawer/)).toBeFalsy();
  });
  it('dom should be existed after close when destroyOnClose is false', () => {
    const { rerender, container } = render(getDrawer());
    expect(screen.queryByText(/Here is content of Drawer/)).toBeTruthy();
    rerender(getDrawer({ visible: false }));
    const ev = new Event('transitionend', { bubbles: true });
    ev.propertyName = 'transform';
    fireEvent(container.querySelector('.ant-drawer-content-wrapper'), ev);
    expect(screen.queryByText(/Here is content of Drawer/)).toBeFalsy();
  });
  it('test afterVisibleChange', async () => {
    const afterVisibleChange = jest.fn();
    const { rerender, container } = render(getDrawer({ afterVisibleChange, visible: true }));
    rerender(getDrawer({ afterVisibleChange, visible: false }));
    const ev = new Event('transitionend', { bubbles: true });
    ev.propertyName = 'transform';
    fireEvent(container.querySelector('.ant-drawer-content-wrapper'), ev);
    expect(afterVisibleChange).toBeCalledTimes(1);
  });
});
