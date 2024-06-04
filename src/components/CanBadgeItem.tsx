import { Box, styled } from 'styled-system/jsx';

export const CanBadgeItem = ({ file }: { file: File }) => {
  return (
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
  );
};
