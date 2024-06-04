import { Container, Stack } from 'styled-system/jsx';

import { Text } from './components/ui/text';

import { useRef, useState } from 'react';
import { Button } from './components/ui/button';
import * as FileUpload from './components/ui/file-upload';
import { Heading } from './components/ui/heading';
import { IconButton } from './components/ui/icon-button';
import { Link } from './components/ui/link';
import { CanBadgeEditor } from './components/CanBadgeEditor';
import * as Tabs from './components/ui/tabs';
import { PhotoEditor } from './components/PhotoEditor';

function App() {
  const fileRef = useRef<HTMLInputElement>(null);

  const [selectedFileList, setSelectedFileList] = useState<File[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);

  const [key, setKey] = useState(new Date().valueOf());

  const handleUpdateFiles = (files: File[]) => {
    setSelectedFileList(files);
  };

  const handleAddFiles = () => {
    if (!fileRef.current) return;
    setFileList((l) => [...l, ...selectedFileList]);
    setSelectedFileList([]);
    setKey(new Date().valueOf());

    fileRef.current.value = '';
  };

  return (
    <>
      <Stack w="full" minH="100vh">
        <Container
          flex={1}
          w="full"
          py={4}
          px={4}
          _print={{ px: 'var(--padding)', py: 'var(--padding)' }}
        >
          <Stack justifyContent="center" alignItems="center">
            <Stack alignItems="center" w="full" _print={{ display: 'none' }}>
              <Heading as="h1" size="2xl" textAlign="center">
                Oshi Cropper
              </Heading>
              <Text>Turn your Oshi pics into different kinds of goods!</Text>
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
              <Button disabled={selectedFileList.length === 0} onClick={() => handleAddFiles()}>
                Add Files
              </Button>
            </Stack>
            <Tabs.Root defaultValue="badge">
              <Tabs.List _print={{ display: 'none' }}>
                <Tabs.Trigger value="badge">Can badge</Tabs.Trigger>
                <Tabs.Trigger value="photo">Bromide Photo</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="badge">
                <CanBadgeEditor fileList={fileList} setFileList={setFileList} />
              </Tabs.Content>
              <Tabs.Content value="photo">
                <PhotoEditor fileList={fileList} setFileList={setFileList} />
              </Tabs.Content>
            </Tabs.Root>
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
    </>
  );
}

export default App;
