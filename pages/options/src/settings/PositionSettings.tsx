import { RadioGroup, RadioGroupItem, Card } from '@extension/ui';

export const PositionSettings = () => {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Position Settings</h2>
      <RadioGroup defaultValue="right-top">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-medium">Static Position</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left-top" id="left-top" />
                <label htmlFor="left-top" className="text-sm font-medium">
                  Left Top
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right-top" id="right-top" />
                <label htmlFor="right-top" className="text-sm font-medium">
                  Right Top
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left-bottom" id="left-bottom" />
                <label htmlFor="left-bottom" className="text-sm font-medium">
                  Left Bottom
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right-bottom" id="right-bottom" />
                <label htmlFor="right-bottom" className="text-sm font-medium">
                  Right Bottom
                </label>
              </div>
            </div>
          </div>
          <div className="border-t pt-6">
            <h3 className="mb-3 text-sm font-medium">Dynamic Position</h3>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="near-cursor" id="near-cursor" />
              <label htmlFor="near-cursor" className="text-sm font-medium">
                Near Cursor
              </label>
            </div>
            <p className="ml-6 mt-1 text-sm text-gray-600">Popup will appear near the mouse cursor position</p>
          </div>
        </div>
      </RadioGroup>
    </Card>
  );
};
