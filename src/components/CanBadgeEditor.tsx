import { chunk } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Grid, GridItem, HStack, Stack } from 'styled-system/jsx';
import { CSSPropertiesWithVars } from '~/types/css';
import { CanBadgeItem } from './CanBadgeItem';
import { ImageEditModal } from './ImageEditModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Text } from './ui/text';

const A4 = {
  width: 210,
  height: 297
} as const;
const GAP = 2;
const PADDING = 5;

const calculatePage = (diameter: number) => {
  const col = Math.floor((A4.width - 2 * PADDING) / (diameter + GAP / 2));
  const rows = Math.floor((A4.height - 2 * PADDING) / (diameter + GAP / 2));
  return col * rows;
};

export const CanBadgeEditor = ({
  fileList,
  setFileList
}: {
  fileList: File[];
  setFileList: Dispatch<SetStateAction<File[]>>;
}) => {
  const [diameter, setDiameter] = useState(80);
  const [area, setArea] = useState(57);
  const [safeMargin, setSafeMargin] = useState(5);
  const [images, setImages] = useState<File[]>([]);

  const [selectedFileIndex, setSelectedFileIndex] = useState<number | undefined>(undefined);
  const handleUpdateImage = (index: number, result: File) => {
    setImages(images.map((f, idx) => (idx === index ? result : f)));
  };

  const perPage = calculatePage(diameter);

  useEffect(() => {
    if (fileList.length !== images.length) {
      if (fileList.length < images.length) setImages(fileList);
      else setImages((s) => [...s, ...fileList.slice(s.length)]);
    }
  }, [fileList]);

  const handleDeleteImage = (i: number) => {
    setFileList((l) => l.filter((_, idx) => idx !== i));
    setImages((l) => l.filter((_, idx) => idx !== i));
  };

  const handleReset = useCallback(() => {
    setDiameter(80);
    setArea(57);
  }, [setDiameter, setArea]);

  return (
    <>
      <Stack
        style={
          {
            '--diameter': diameter + 'mm',
            '--image-area': area + 'mm',
            '--gap': GAP + 'mm',
            '--padding': PADDING + 'mm',
            '--safe-margin': safeMargin + 'mm'
          } as CSSPropertiesWithVars
        }
      >
        <Stack>
          <Stack _print={{ display: 'none' }}>
            <HStack>
              <Text>Diameter (mm)</Text>
              <Input
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(Number(e.target.value))}
              />
              <Text>Area (mm)</Text>
              <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} />
              <Text>Safe Margin (mm)</Text>
              <Input
                type="number"
                value={safeMargin}
                onChange={(e) => setSafeMargin(Number(e.target.value))}
              />
              <Button onClick={handleReset}>Reset</Button>
            </HStack>
          </Stack>
          {chunk(images, perPage).map((data, page: number) => {
            return (
              <Grid
                key={page}
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
                {data.map((file, index) => (
                  <GridItem
                    key={index}
                    onClick={() => setSelectedFileIndex(perPage * page + index)}
                    display="block"
                    position="relative"
                  >
                    <CanBadgeItem file={file} />
                  </GridItem>
                ))}
              </Grid>
            );
          })}
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
          aspectRatio={1}
          rounded
        />
      )}
    </>
  );
};
