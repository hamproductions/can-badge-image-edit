import { useState } from 'react';
import * as Dialog from '../components/ui/dialog';
import { Stack } from 'styled-system/jsx';
import { Button } from './ui/button';
import { IconButton } from './ui/icon-button';
import Cropper, { Area } from 'react-easy-crop';
import getCroppedImg from '~/utils/image';
import { css } from 'styled-system/css';
import { saveAs } from 'file-saver';

export const ImageEditModal = ({
  file,
  onClose,
  onFileEdited,
  onDelete,
  rounded,
  aspectRatio: _aspectRatio = 1,
  saveable
}: {
  file?: File;
  onClose: () => void;
  onFileEdited: (res: File) => void;
  onDelete: () => void;
  aspectRatio: number;
  rounded?: boolean;
  saveable?: boolean;
}) => {
  const [aspectRatio, setAspectRatio] = useState(_aspectRatio);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area>();

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleDownloadPic = async () => {
    if (!file || !croppedArea) return;
    const croppedFile = await getCroppedImg(URL.createObjectURL(file), croppedArea);
    if (!croppedFile) return;
    saveAs(croppedFile);
  };

  const handleSave = async () => {
    if (!file || !croppedArea) return;
    const croppedFile = await getCroppedImg(URL.createObjectURL(file), croppedArea);
    if (!croppedFile) return;
    onFileEdited(croppedFile);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const handleFlipOrientation = () => setAspectRatio((a) => 1 / a);

  return (
    <Dialog.Root
      open={!!file}
      onOpenChange={(isOpen) => {
        if (!isOpen.open) {
          onClose();
        }
      }}
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack gap="8" p="6">
            <Stack gap="1">
              <Dialog.Title>Crop Image</Dialog.Title>
              {/* <Dialog.Description>Dialog Description</Dialog.Description> */}
              <Stack position="relative" height="500px">
                {file && (
                  <Cropper
                    image={URL.createObjectURL(file)}
                    crop={crop}
                    aspect={aspectRatio}
                    maxZoom={5}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    cropShape={rounded ? 'round' : 'rect'}
                    showGrid
                    classes={{
                      cropAreaClassName: css({})
                    }}
                    zoom={zoom}
                  />
                )}
              </Stack>
              {aspectRatio !== 1 && <Button onClick={handleFlipOrientation}>Flip</Button>}
            </Stack>
            <Stack gap="3" direction="row" width="full">
              <Button
                onClick={() => {
                  handleDelete();
                }}
                colorPalette="red"
              >
                Delete
              </Button>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" width="full">
                  Cancel
                </Button>
              </Dialog.CloseTrigger>
              <Button
                onClick={() => {
                  void handleSave();
                }}
                width="full"
              >
                Save
              </Button>
              {saveable && (
                <Button
                  onClick={() => {
                    void handleDownloadPic();
                  }}
                  colorPalette="green"
                >
                  Save
                </Button>
              )}
            </Stack>
          </Stack>
          <Dialog.CloseTrigger asChild position="absolute" top="2" right="2">
            <IconButton aria-label="Close Dialog" variant="ghost" size="sm">
              Close
            </IconButton>
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
