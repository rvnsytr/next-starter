import { useIsMobile } from "@/core/hooks/use-media-query";
import { createContext, useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

const ModalContext = createContext<boolean>(false);

export function Modal({
  ...props
}: React.ComponentProps<typeof Drawer> & React.ComponentProps<typeof Dialog>) {
  const isMobile = useIsMobile();
  const Comp = isMobile ? Drawer : Dialog;
  return (
    <ModalContext.Provider value={isMobile}>
      <Comp {...props} />
    </ModalContext.Provider>
  );
}

export function ModalTrigger({
  ...props
}: React.ComponentProps<typeof DrawerTrigger> &
  React.ComponentProps<typeof DialogTrigger>) {
  const isMobile = useContext(ModalContext);
  const Comp = isMobile ? DrawerTrigger : DialogTrigger;
  return <Comp {...props} />;
}

export function ModalContent({
  ...props
}: React.ComponentProps<typeof DrawerContent> &
  React.ComponentProps<typeof DialogContent>) {
  const isMobile = useContext(ModalContext);
  const Comp = isMobile ? DrawerContent : DialogContent;
  return <Comp {...props} />;
}

export function ModalHeader({
  ...props
}: React.ComponentProps<typeof DrawerHeader> &
  React.ComponentProps<typeof DialogHeader>) {
  const isMobile = useContext(ModalContext);
  const Comp = isMobile ? DrawerHeader : DialogHeader;
  return <Comp {...props} />;
}

export function ModalFooter({
  ...props
}: React.ComponentProps<typeof DrawerFooter> &
  React.ComponentProps<typeof DialogFooter>) {
  const isMobile = useContext(ModalContext);
  const Comp = isMobile ? DrawerFooter : DialogFooter;
  return <Comp {...props} />;
}

export function ModalTitle({
  ...props
}: React.ComponentProps<typeof DrawerTitle> &
  React.ComponentProps<typeof DialogTitle>) {
  const isMobile = useContext(ModalContext);
  const Comp = isMobile ? DrawerTitle : DialogTitle;
  return <Comp {...props} />;
}

export function ModalDescription({
  ...props
}: React.ComponentProps<typeof DrawerDescription> &
  React.ComponentProps<typeof DialogDescription>) {
  const isMobile = useContext(ModalContext);
  const Comp = isMobile ? DrawerDescription : DialogDescription;
  return <Comp {...props} />;
}
