import { styled, Box, Container, Grid, GridItem, HStack, Stack } from 'styled-system/jsx';

import { Text } from './components/ui/text';

import { Link } from './components/ui/link';
import { Input } from './components/ui/input';
import { useCallback, useRef, useState } from 'react';
import { CSSPropertiesWithVars } from './types/css';
import { Heading } from './components/ui/heading';
import { chunk } from 'lodash';
import { Button } from './components/ui/button';
import * as FileUpload from './components/ui/file-upload';
import { IconButton } from './components/ui/icon-button';
import { ImageEditModal } from './components/ImageEditModal';

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

function App() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [diameter, setDiameter] = useState(80);
  const [area, setArea] = useState(57);
  const [safeMargin, setSafeMargin] = useState(5);
  const [selectedFileList, setSelectedFileList] = useState<File[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [key, setKey] = useState(new Date().valueOf());
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | undefined>(undefined);

  const handleReset = useCallback(() => {
    setDiameter(80);
    setArea(57);
  }, [setDiameter, setArea]);

  const handleUpdateFiles = (files: File[]) => {
    setSelectedFileList(files);
  };

  const handleUpdateImage = (index: number, result: File) => {
    setImages(images.map((f, idx) => (idx === index ? result : f)));
  };

  const handleAddFiles = () => {
    if (!fileRef.current) return;
    setFileList((l) => [...l, ...selectedFileList]);
    setImages((l) => [...l, ...selectedFileList]);
    setSelectedFileList([]);
    setKey(new Date().valueOf());
    // eslint-disable-next-line react-compiler/react-compiler
    fileRef.current.value = '';
  };

  const perPage = calculatePage(diameter);

  const handleDeleteImage = (i: number) => {
    setFileList((l) => l.filter((_, idx) => idx !== i));
    setImages((l) => l.filter((_, idx) => idx !== i));
  };

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
        w="full"
        minH="100vh"
      >
        <Container
          flex={1}
          w="full"
          py={4}
          px={4}
          _print={{ px: 'var(--padding)', py: 'var(--padding)' }}
        >
          <Stack justifyContent="center" alignItems="center">
            <Stack alignItems="center" _print={{ display: 'none' }}>
              <Heading as="h1" size="2xl" textAlign="center">
                Oshi Cropper
              </Heading>
              <Heading as="h3" size="xl">
                Settings
              </Heading>
              <FileUpload.Root
                key={key}
                maxFiles={Infinity}
                onFileChange={(event) => {
                  handleUpdateFiles(event.acceptedFiles);
                }}
              >
                <FileUpload.Dropzone>
                  <FileUpload.Label>Drop your files here</FileUpload.Label>
                  <FileUpload.Trigger asChild>
                    <Button size="sm">Open Dialog</Button>
                  </FileUpload.Trigger>
                </FileUpload.Dropzone>
                <FileUpload.ItemGroup>
                  <FileUpload.Context>
                    {({ acceptedFiles }) =>
                      acceptedFiles.map((file, id) => (
                        <FileUpload.Item key={id} file={file}>
                          <FileUpload.ItemPreview type="image/*">
                            <FileUpload.ItemPreviewImage />
                          </FileUpload.ItemPreview>
                          <FileUpload.ItemName />
                          <FileUpload.ItemSizeText />
                          <FileUpload.ItemDeleteTrigger asChild>
                            <IconButton variant="link" size="sm">
                              Delete
                            </IconButton>
                          </FileUpload.ItemDeleteTrigger>
                        </FileUpload.Item>
                      ))
                    }
                  </FileUpload.Context>
                </FileUpload.ItemGroup>
                <FileUpload.HiddenInput type="file" ref={fileRef} accept="image/*" />
              </FileUpload.Root>
              <HStack>
                <Text>Diameter (mm)</Text>
                <Input
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(Number(e.target.value))}
                />
                <Text>Area (mm)</Text>
                <Input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                />
                <Text>Safe Margin (mm)</Text>
                <Input
                  type="number"
                  value={safeMargin}
                  onChange={(e) => setSafeMargin(Number(e.target.value))}
                />
                <Button onClick={handleReset}>Reset</Button>
              </HStack>

              <Button disabled={selectedFileList.length === 0} onClick={() => handleAddFiles()}>
                Add Files
              </Button>
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
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        border="1px dashed"
                        rounded="full"
                        w="var(--diameter, 80mm)"
                        h="var(--diameter, 80mm)"
                      >
                        <Box position="relative" rounded="full" p="var(--safe-margin, 2mm)">
                          <styled.img
                            src={URL.createObjectURL(file)}
                            position="absolute"
                            top="0"
                            left="0"
                            objectFit="cover"
                            rounded="full"
                            w="full"
                            h="full"
                          ></styled.img>
                          <Box
                            zIndex="3"
                            position="relative"
                            border="1px dashed"
                            borderColor="red"
                            rounded="full"
                            w="var(--image-area, 57mm)"
                            h="var(--image-area, 57mm)"
                            _print={{
                              border: 'none'
                            }}
                          ></Box>
                        </Box>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              );
            })}
            <Stack _print={{ display: 'none' }}>
              <Button onClick={() => print()}>Print</Button>
            </Stack>
          </Stack>
        </Container>
        <Stack
          gap="1"
          justifyContent="center"
          w="full"
          p="4"
          textAlign="center"
          bgColor="bg.muted"
          _print={{ display: 'none' }}
        >
          <Text>
            Created by{' '}
            <Link href="https://ham-san.net/namecard" target="_blank">
              ハムP
            </Link>{' '}
            | Source Code on{' '}
            <Link href="https://github.com/hamproductions/oshi-cropper" target="_blank">
              GitHub
            </Link>
          </Text>
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
        />
      )}
    </>
  );
}

export default App;
