import { mount } from '@usevibejs/ui/testing';
import { describe, expect, it, vi } from 'vitest';
import Badge from '../site/src/components/ui/Badge.vibe';
import Button from '../site/src/components/ui/Button.vibe';
import Card from '../site/src/components/ui/Card.vibe';
import CardAction from '../site/src/components/ui/CardAction.vibe';
import CardContent from '../site/src/components/ui/CardContent.vibe';
import CardDescription from '../site/src/components/ui/CardDescription.vibe';
import CardFooter from '../site/src/components/ui/CardFooter.vibe';
import CardHeader from '../site/src/components/ui/CardHeader.vibe';
import CardTitle from '../site/src/components/ui/CardTitle.vibe';
import Input from '../site/src/components/ui/Input.vibe';
import Label from '../site/src/components/ui/Label.vibe';
import Separator from '../site/src/components/ui/Separator.vibe';
import Skeleton from '../site/src/components/ui/Skeleton.vibe';
import Textarea from '../site/src/components/ui/Textarea.vibe';
import Fields from './Fields.vibe';

describe('Button', () => {
  it('defaults to a non-submitting button and forwards attributes, listeners and slots', async () => {
    const click = vi.fn<(event: MouseEvent) => void>();
    const wrapper = mount(Button, {
      props: { id: 'save', onClick: click, name: 'action', value: 'save', class: 'px-8' },
      slots: { default: 'Save changes' },
    });
    expect(wrapper.get('button').attributes()).toMatchObject({
      id: 'save',
      type: 'button',
      name: 'action',
      value: 'save',
    });
    expect(wrapper.text()).toBe('Save changes');
    expect(wrapper.classes()).toContain('px-8');
    expect(wrapper.classes()).not.toContain('px-4');
    await wrapper.get('button').trigger('click');
    expect(click).toHaveBeenCalledOnce();
    await wrapper.setProps({ disabled: true, type: 'submit' });
    expect(wrapper.get('button').element.disabled).toBe(true);
    expect(wrapper.attributes('type')).toBe('submit');
    await wrapper.get('button').trigger('click');
    expect(click).toHaveBeenCalledOnce();
  });
  it.each(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const)(
    'renders the %s variant',
    (variant) => {
      const wrapper = mount(Button, { props: { variant, size: 'sm' } });
      expect(wrapper.attributes('data-variant')).toBe(variant);
      expect(wrapper.attributes('data-size')).toBe('sm');
      expect(wrapper.classes()).toContain('h-8');
    },
  );
  it.each([
    ['default', 'h-9'],
    ['sm', 'h-8'],
    ['lg', 'h-10'],
    ['icon', 'size-9'],
  ] as const)('renders size %s', (size, token) => {
    expect(mount(Button, { props: { size } }).classes()).toContain(token);
  });
});

describe('text fields', () => {
  it.each(['text', 'email', 'password', 'search', 'tel', 'url'] as const)(
    'preserves native %s behavior and emits the string model',
    async (type) => {
      const wrapper = mount(Input, {
        props: {
          type,
          modelValue: 'hello',
          name: 'field',
          placeholder: 'Write here',
          required: true,
        },
      });
      const field = wrapper.get('input');
      expect(field.element.type).toBe(type);
      expect(field.element.value).toBe('hello');
      expect(field.attributes()).toMatchObject({ name: 'field', placeholder: 'Write here' });
      expect(field.element.required).toBe(true);
      await field.setValue('updated');
      expect(wrapper.emitted('update:modelValue')).toEqual([['updated']]);
      await wrapper.setProps({
        modelValue: 'parent update',
        disabled: true,
        placeholder: 'Changed',
      });
      expect(field.element.value).toBe('parent update');
      expect(field.element.disabled).toBe(true);
      expect(field.attributes('placeholder')).toBe('Changed');
    },
  );
  it('updates the active input type and preserves its value', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'secret' } });
    expect(wrapper.get('input').element.type).toBe('text');
    await wrapper.setProps({ type: 'password' });
    expect(wrapper.get('input').element.type).toBe('password');
    expect(wrapper.get('input').element.value).toBe('secret');
  });
  it('preserves IME composition before committing a model value', async () => {
    const wrapper = mount(Input);
    const field = wrapper.get('input');
    await field.trigger('compositionstart');
    field.element.value = 'composing';
    await field.trigger('input');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    await field.trigger('compositionend');
    expect(wrapper.emitted('update:modelValue')).toEqual([['composing']]);
  });
  it('supports multiline input, parent updates and native constraints', async () => {
    const wrapper = mount(Textarea, {
      props: {
        rows: 4,
        modelValue: 'First line',
        readonly: true,
        autocomplete: 'off',
        class: 'min-h-40',
      },
    });
    const field = wrapper.get('textarea');
    expect(field.element.rows).toBe(4);
    expect(field.element.readOnly).toBe(true);
    expect(field.classes()).toContain('min-h-40');
    expect(field.classes()).not.toContain('min-h-24');
    await wrapper.setProps({ readonly: false, modelValue: 'From parent', disabled: true });
    expect(field.element.value).toBe('From parent');
    expect(field.element.disabled).toBe(true);
    await wrapper.setProps({ disabled: false });
    await field.setValue('First\nSecond');
    expect(wrapper.emitted('update:modelValue')).toEqual([['First\nSecond']]);
  });
  it('shares models through a parent and exposes focus on both fields', async () => {
    const wrapper = mount(Fields);
    await wrapper.get('input').setValue('Shared value');
    expect(wrapper.get('textarea').element.value).toBe('Shared value');
    expect(wrapper.get('output').text()).toBe('Shared value');
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    expect(document.activeElement).toBe(wrapper.get('input').element);
    await buttons[1].trigger('click');
    expect(document.activeElement).toBe(wrapper.get('textarea').element);
  });
});

describe('layout and status components', () => {
  it.each([Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter])(
    'forwards Card part content and attributes',
    (component) => {
      const wrapper = mount(component, {
        props: { id: 'part', class: 'px-10' },
        slots: { default: 'Content' },
      });
      expect(wrapper.attributes('id')).toBe('part');
      expect(wrapper.text()).toBe('Content');
      expect(wrapper.classes()).toContain('px-10');
    },
  );
  it('uses an explicit heading for CardTitle and associates labels with fields', () => {
    expect(mount(CardTitle).get('h3').exists()).toBe(true);
    const label = mount(Label, { props: { for: 'email' }, slots: { default: 'Email' } });
    expect(label.get('label').attributes('for')).toBe('email');
    expect(label.text()).toBe('Email');
  });
  it.each(['default', 'secondary', 'destructive', 'outline'] as const)(
    'renders the %s Badge',
    (variant) => {
      const badge = mount(Badge, { props: { variant }, slots: { default: 'Status' } });
      expect(badge.attributes('data-variant')).toBe(variant);
      expect(badge.text()).toBe('Status');
    },
  );
  it('uses a default Badge variant and allows reactive class overrides', async () => {
    const badge = mount(Badge);
    expect(badge.attributes('data-variant')).toBe('default');
    await badge.setProps({ class: 'rounded-md' });
    expect(badge.classes()).toContain('rounded-md');
    expect(badge.classes()).not.toContain('rounded-full');
  });
  it('is decorative by default and exposes orientation when semantic', async () => {
    const separator = mount(Separator);
    expect(separator.attributes('role')).toBe('none');
    expect(separator.attributes('aria-hidden')).toBe('true');
    expect(separator.attributes('aria-orientation')).toBeUndefined();
    await separator.setProps({ decorative: false });
    expect(separator.attributes()).toMatchObject({
      role: 'separator',
      'aria-orientation': 'horizontal',
    });
    await separator.setProps({ orientation: 'vertical' });
    expect(separator.classes()).toContain('w-px');
    expect(separator.attributes('aria-orientation')).toBe('vertical');
    await separator.setProps({ decorative: true });
    expect(separator.attributes('role')).toBe('none');
    expect(separator.attributes('aria-hidden')).toBe('true');
    expect(separator.attributes('aria-orientation')).toBeUndefined();
  });
  it('makes loading placeholders decorative and respects reduced motion', () => {
    const skeleton = mount(Skeleton, { props: { class: 'h-6 w-32' } });
    expect(skeleton.attributes('aria-hidden')).toBe('true');
    expect(skeleton.classes()).toContain('motion-reduce:animate-none');
    expect(skeleton.classes()).toContain('h-6');
  });
});
