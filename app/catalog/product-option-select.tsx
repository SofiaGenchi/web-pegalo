'use client';
import { Select } from '@base-ui/react/select';

export default function ProductOptionSelect({ value, options, onChange, label }: {
  value: string;
  options: { key: string; label: string }[];
  onChange: (value: string) => void;
  label: string;
}) {
  return (
    <Select.Root value={value} onValueChange={(next) => { if (next !== null) onChange(next); }} items={options.map(option => ({ value: option.key, label: option.label }))}>
      <Select.Trigger className="product-option-trigger" aria-label={label}>
        <Select.Value />
        <span className="product-option-action" aria-hidden="true">Elegir</span>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className="product-option-positioner" sideOffset={6} alignItemWithTrigger={false}>
          <Select.Popup className="product-option-popup">
            <Select.List>
              {options.map(option => (
                <Select.Item key={option.key} value={option.key} className="product-option-item">
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator className="product-option-check">✓</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
