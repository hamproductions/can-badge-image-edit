import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Grid, GridItem, Stack, styled } from 'styled-system/jsx';
import { PAPER_SIZES, PaperSize } from '~/constants/paper';
import { CSSPropertiesWithVars } from '~/types/css';

import { ImageEditModal } from './ImageEditModal';
import * as RadioGroup from './ui/radio-group';

export const PhotoEditor = ({
  fileList,
  setFileList
}: {
  fileList: File[];
  setFileList: Dispatch<SetStateAction<File[]>>;
}) => {
  const [paperSize, setPaperSize] = useState<PaperSize>('l');
  const [images, setImages] = useState<File[]>([]);

  const [selectedFileIndex, setSelectedFileIndex] = useState<number | undefined>(undefined);
  const handleUpdateImage = (index: number, result: File) => {
    setImages(images.map((f, idx) => (idx === index ? result : f)));
  };

  useEffect(() => {
    console.log(images, fileList, fileList.length - images.length);
    if (fileList.length !== images.length) {
      if (fileList.length < images.length) setImages(fileList);
      else setImages((s) => [...s, ...fileList.slice(s.length)]);
    }
  }, [fileList]);

  const handleDeleteImage = (i: number) => {
    setFileList((l) => l.filter((_, idx) => idx !== i));
    setImages((l) => l.filter((_, idx) => idx !== i));
  };

  return (
    <>
      <Stack
        style={
          {
            '--width': PAPER_SIZES[paperSize].width + 'mm',
            '--height': PAPER_SIZES[paperSize].height + 'mm'
          } as CSSPropertiesWithVars
        }
      >
        <Stack>
          <Stack _print={{ display: 'none' }}>
            <RadioGroup.Root
              size="sm"
              orientation="horizontal"
              defaultValue="l"
              value={paperSize}
              onValueChange={(e) => setPaperSize(e.value as PaperSize)}
            >
              <RadioGroup.Label>Paper Size</RadioGroup.Label>
              {Object.keys(PAPER_SIZES).map((size) => (
                <RadioGroup.Item key={size} value={size}>
                  <RadioGroup.ItemControl />
                  <RadioGroup.ItemText>{size.toUpperCase()}</RadioGroup.ItemText>
                  <RadioGroup.ItemHiddenInput />
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>
          </Stack>
          <Grid
            style={{ WebkitPrintColorAdjust: 'exact' }}
            justifyContent="space-around"
            alignContent="space-between"
            alignItems="center"
            gridTemplateColumns="repeat(auto-fill, var(--diameter, 80mm))"
            w="full"
            justifyItems="center"
            pageBreakBefore="always"
            _print={{ h: 'full', gridGap: 'var(--gap)' }}
          >
            {images.map((file, index) => (
              <GridItem
                key={index}
                onClick={() => setSelectedFileIndex(index)}
                display="block"
                position="relative"
              >
                <styled.img
                  src={URL.createObjectURL(file)}
                  objectFit="cover"
                  w="var(--width)"
                  h="var(--height)"
                />
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </Stack>
      {selectedFileIndex !== undefined && fileList[selectedFileIndex] && (
        <ImageEditModal
          file={fileList[selectedFileIndex]}
          onClose={() => setSelectedFileIndex(undefined)}
          onFileEdited={(result) => handleUpdateImage(selectedFileIndex, result)}
          onDelete={() => {
            handleDeleteImage(selectedFileIndex);
          }}
          saveable
          aspectRatio={PAPER_SIZES[paperSize].width / PAPER_SIZES[paperSize].height}
        />
      )}
    </>
  );
};
