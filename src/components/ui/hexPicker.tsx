import  { Dispatch, SetStateAction } from "react"
import { Color } from "react-aria-components"
 
import { Button } from "@/components/ui/button"
import {
  ColorArea,
  ColorField,
  ColorPicker,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  SliderTrack,
} from "@/components/ui/color"
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/field"
import { Input } from "@/components/ui/textfield"
 
export function HexPicker({
    color,
    setColor
}: {
    color: Color
    setColor: Dispatch<SetStateAction<Color>>
}) {
 
  return (
    <ColorPicker value={color} onChange={setColor}>
      <DialogTrigger>
        <Button variant="ghost" className="flex h-fit items-center gap-2 p-1 justify-start">
          <ColorSwatch className="size-8 rounded-md border-2" />
          色を選択
        </Button>
        <DialogOverlay>
        <DialogContent className="sm:max-w-[270px]">
          <Dialog className="flex flex-col gap-4 p-3 outline-none">
            <div>
              <ColorArea
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                className="h-[164px] rounded-b-none border-b-0"
              >
                <ColorThumb className="z-50" />
              </ColorArea>
              <ColorSlider colorSpace="hsb" channel="hue">
                <SliderTrack className="rounded-t-none border-t-0">
                  <ColorThumb className="top-1/2" />
                </SliderTrack>
              </ColorSlider>
            </div>
            <ColorField colorSpace="hsb" className="w-[192px]">
              <Label>Hex</Label>
              <Input className="" />
            </ColorField>
            <ColorSwatchPicker className="w-[192px]">
              <ColorSwatchPickerItem color="#F00">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#f90">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#0F0">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#08f">
                <ColorSwatch />
              </ColorSwatchPickerItem>
              <ColorSwatchPickerItem color="#00f">
                <ColorSwatch />
              </ColorSwatchPickerItem>
            </ColorSwatchPicker>
            </Dialog>
        </DialogContent>
        </DialogOverlay>
      </DialogTrigger>
    </ColorPicker>
  )
}
 
