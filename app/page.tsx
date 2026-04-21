// export const metadata: Metadata = { title: "Current Page" };

// export default function Page() {
//   return (
//     <div>Page</div>
//   )
// }

import { FooterNote } from "@/core/components/layout/footer-note";
import { PageTitle } from "@/core/components/layout/page";
import { PasswordInput } from "@/core/components/password-input";
import { QuickSearch, QuickSearchGroup } from "@/core/components/quick-search";
import { Scrollspy } from "@/core/components/scroll-spy";
import { ThemeToggle } from "@/core/components/theme";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/core/components/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/core/components/ui/alert";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/core/components/ui/alert-dialog";
import { AnimateOnView } from "@/core/components/ui/animate-on-view";
import {
  Badge,
  CustomColorBadge,
  GenderBadge,
} from "@/core/components/ui/badge";
import { BoxReveal } from "@/core/components/ui/box-reveal";
import {
  Button,
  CopyButton,
  PulsatingButton,
  RefreshButton,
  ResetButton,
} from "@/core/components/ui/button";
import { ButtonGroup } from "@/core/components/ui/button-group";
import { Calendar } from "@/core/components/ui/calendar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import { DetailList } from "@/core/components/ui/detail-list";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/core/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/core/components/ui/drawer";
import { ErrorFallback, LoadingFallback } from "@/core/components/ui/fallback";
import { Field, FieldLabel } from "@/core/components/ui/field";
import { Fieldset } from "@/core/components/ui/fieldset";
import { Input } from "@/core/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/core/components/ui/input-group";
import { Label } from "@/core/components/ui/label";
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
  MenuTrigger,
} from "@/core/components/ui/menu";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/core/components/ui/number-field";
import { Ping } from "@/core/components/ui/ping";
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { R } from "@/core/components/ui/r";
import { Scales, ScalesWrapper } from "@/core/components/ui/scales";
import {
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectPopup,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Separator } from "@/core/components/ui/separator";
import { LinkSpinner } from "@/core/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/core/components/ui/timeline";
import { cn, toCase } from "@/core/utils";
import { DocsContentWrapper } from "@/modules/docs/components/docs-content-wrapper";
import { DocsSection } from "@/modules/docs/components/docs-section";
import {
  AutocompleteExample,
  ComboboxExample,
  StepperExample,
  ToastExample,
  UseFileUploadExample,
} from "@/modules/docs/components/examples";
import { FormExample } from "@/modules/docs/components/form-example";
import { Docs } from "@/modules/docs/config";
import { formatForDisplay } from "@tanstack/react-hotkeys";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  BellIcon,
  BookSearchIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CircleDotIcon,
  CircleFadingArrowUpIcon,
  CpuIcon,
  DotIcon,
  Layers2Icon,
  LayoutGridIcon,
  LogInIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  ShapesIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SquareSquareIcon,
  TrashIcon,
  TriangleAlertIcon,
  UserRoundIcon,
  WandSparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

const docs: Docs[] = [
  {
    icon: SquareSquareIcon,
    section: "Core",
    content: [
      {
        type: "docs",
        label: "Data Controller",
        refs: [{ url: "/#featured-components-data-controller" }],
      },
      { type: "docs", label: "Data Filter" },
      { type: "docs", label: "Fetcher" },
      { type: "docs", label: "Storage" },
    ],
  },

  {
    icon: CpuIcon,
    section: "Core Hooks",
    content: [
      { type: "docs", label: "use-copy-to-clipboard", refs: ["cosshooks"] },
      { type: "docs", label: "use-debounce" },
      {
        type: "docs",
        label: "use-file-upload",
        refs: [
          {
            label: "REUI Hooks",
            url: "https://reui.io/docs/components/base/file-upload",
          },
        ],
        render: <UseFileUploadExample />,
      },
      { type: "docs", label: "use-is-mounted" },
      { type: "docs", label: "use-media-query", refs: ["cosshooks"] },
      { type: "docs", label: "use-validated-swr" },
    ],
  },

  {
    icon: CircleFadingArrowUpIcon,
    section: "Featured Components",
    content: [
      {
        type: "comp",
        label: "Data Controller",
        variants: [{ label: "Data Table", render: "To Do" }],
        refs: [{ url: "/#core-data-controller" }],
      },
      { type: "comp", label: "Date Picker" },
      {
        type: "comp",
        label: "Dynamic Bcreadcrumb",
        refs: [{ url: "/#components-breadcrumb" }],
      },
      {
        type: "comp",
        label: "File Upload",
        render: (
          <Button
            size="sm"
            variant="link"
            render={
              <Link href="/#examples-form">
                <small>Go to Form example below</small>
                <ArrowDownIcon className="size-4" />
              </Link>
            }
          />
        ),
      },
      { type: "comp", label: "Filters", refs: ["reui"] },
      { type: "comp", label: "Import Dialog" },
      {
        type: "comp",
        label: "Password Input",
        render: (
          <PasswordInput placeholder="Enter your password" withValidationList />
        ),
      },
      { type: "comp", label: "Scrollspy", refs: ["reui"] },
      {
        type: "comp",
        label: "Quick Search",
        render: <small>Navbar Quick Search (Desktop Only)</small>,
        refs: [{ url: "/#components-command" }],
      },
    ],
  },

  {
    icon: LayoutGridIcon,
    section: "Layout Components",
    content: [
      { type: "comp", label: "Page" },
      {
        type: "comp",
        label: "Footer Note",
        render: <small>At the bottom of this page.</small>,
      },
      {
        type: "comp",
        label: "Sidebar",
        refs: ["shadcnui"],
        render: (
          <Button
            size="sm"
            variant="link"
            render={
              <Link href="/dashboard">
                Go to Dashboard
                <LinkSpinner icon={{ base: <ArrowRightIcon /> }} />
              </Link>
            }
          />
        ),
      },
    ],
  },

  {
    icon: CircleDotIcon,
    section: "Components",
    content: [
      {
        type: "comp",
        label: "Accordion",
        refs: ["cossui"],
        render: (
          <Accordion className="max-w-lg">
            <AccordionItem value="shipping">
              <AccordionTrigger>
                What are your shipping options?
              </AccordionTrigger>
              <AccordionPanel>
                We offer standard (5-7 days), express (2-3 days), and overnight
                shipping. Free shipping on international orders.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionPanel>
                Returns accepted within 30 days. Items must be unused and in
                original packaging. Refunds processed within 5-7 business days.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="support">
              <AccordionTrigger>
                How can I contact customer support?
              </AccordionTrigger>
              <AccordionPanel>
                Reach us via email, live chat, or phone. We respond within 24
                hours during business days.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        ),
      },
      {
        type: "comp",
        label: "Alert",
        refs: ["cossui"],
        render: (
          <div className="grid w-full max-w-md items-start gap-4">
            <Alert>
              <CheckIcon />
              <AlertTitle>Payment successful</AlertTitle>
              <AlertDescription>
                Your payment of $29.99 has been processed. A receipt has been
                sent to your email address.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <TriangleAlertIcon />
              <AlertTitle>New feature available</AlertTitle>
              <AlertDescription>
                We&apos;ve added dark mode support. You can enable it in your
                account settings.
              </AlertDescription>
            </Alert>
          </div>
        ),
      },
      {
        type: "comp",
        label: "Alert Dialog",
        refs: ["cossui"],
        render: (
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="destructive-outline" />}
            >
              Delete Account
            </AlertDialogTrigger>
            <AlertDialogPopup>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <TriangleAlertIcon /> Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogClose render={<Button variant="ghost" />}>
                  Cancel
                </AlertDialogClose>
                <AlertDialogClose render={<Button variant="destructive" />}>
                  Delete Account
                </AlertDialogClose>
              </AlertDialogFooter>
            </AlertDialogPopup>
          </AlertDialog>
        ),
      },
      {
        type: "comp",
        label: "Autocomplete",
        refs: ["cossui"],
        render: (
          <>
            <div className="flex w-full max-w-lg gap-2">
              <AutocompleteExample size="sm" />
              <Button size="icon-sm">
                <SendIcon />
              </Button>
            </div>
            <div className="flex w-full max-w-lg gap-2">
              <AutocompleteExample />
              <Button size="icon">
                <SendIcon />
              </Button>
            </div>
            <div className="flex w-full max-w-lg gap-2">
              <AutocompleteExample size="lg" />
              <Button size="icon-lg">
                <SendIcon />
              </Button>
            </div>
          </>
        ),
      },
      { type: "comp", label: "Avatar", refs: ["shadcnui"] },
      {
        type: "comp",
        label: "Badge",
        refs: ["shadcnui"],
        render: (
          <div className="flex flex-col items-center gap-y-2 *:flex *:flex-wrap *:items-center *:justify-center *:gap-2 **:capitalize">
            <div>
              <Badge variant="outline">
                <CheckIcon /> verified
              </Badge>
              <Badge variant="outline" className="aspect-square">
                1
              </Badge>
              <Badge variant="link" render={<Link href="/">With Link</Link>} />
            </div>

            <Separator className="my-1" />

            <div>
              <Badge>Default</Badge>
              <Badge variant="secondary">secondary</Badge>
              <Badge variant="outline">outline</Badge>
              <Badge variant="ghost">ghost</Badge>
              <Badge variant="link">link</Badge>
            </div>

            <div>
              <Badge variant="success">success</Badge>
              <Badge variant="warning">warning</Badge>
              <Badge variant="info">info</Badge>
              <Badge variant="destructive">destructive</Badge>
            </div>
          </div>
        ),
        variants: [
          {
            label: "Custom Color Badge",
            render: (
              <div className="flex flex-wrap justify-center gap-2">
                <CustomColorBadge color="var(--color-muted-foreground)">
                  Muted Foreground
                </CustomColorBadge>

                <CustomColorBadge color="black" darkColor="white">
                  Black and White
                </CustomColorBadge>

                <CustomColorBadge
                  color="orange"
                  render={<Link href="/">Orange with Link</Link>}
                />
              </div>
            ),
          },
          {
            label: "GenderBadge",
            render: (
              <div className="flex flex-wrap justify-center gap-2">
                <GenderBadge value="m" />
                <GenderBadge value="f" />
              </div>
            ),
          },
        ],
      },
      { type: "comp", label: "Breadcrumb", refs: ["shadcnui"] },
      {
        type: "comp",
        label: "Button",
        refs: ["cossui"],
        render: (
          <div className="flex flex-col items-center gap-y-2 *:flex *:flex-wrap *:items-center *:justify-center *:gap-2 **:capitalize">
            <div>
              <Button variant="default">default</Button>
              <Button variant="secondary">secondary</Button>
              <Button variant="outline">outline</Button>
              <Button variant="ghost">ghost</Button>
              <Button variant="link">link</Button>
            </div>

            <div>
              <Button variant="success">success</Button>
              <Button variant="success-outline">success</Button>
              <Button variant="success-ghost">success</Button>
            </div>

            <div>
              <Button variant="warning">warning</Button>
              <Button variant="warning-outline">warning</Button>
              <Button variant="warning-ghost">warning</Button>
            </div>

            <div>
              <Button variant="info">info</Button>
              <Button variant="info-outline">info</Button>
              <Button variant="info-ghost">info</Button>
            </div>

            <div>
              <Button variant="destructive">destructive</Button>
              <Button variant="destructive-outline">destructive</Button>
              <Button variant="destructive-ghost">destructive</Button>
            </div>
          </div>
        ),
        variants: [
          { label: "Copy Button", render: <CopyButton value="Next Starter" /> },
          {
            label: "Pulsating Button",
            render: (
              <PulsatingButton href="/">Pulsating Button</PulsatingButton>
            ),
          },
          { label: "Refresh Button", render: <RefreshButton /> },
          { label: "Reset Button", render: <ResetButton /> },
          {
            label: "Scroll To Top Button",
            render: <small>In the bottom right corner of the screen.</small>,
          },
        ],
      },
      {
        type: "comp",
        label: "Button Group",
        refs: ["shadcnui"],
        render: (
          <ButtonGroup>
            <Button variant="outline">Button 1</Button>
            <Button variant="outline">Button 2</Button>
          </ButtonGroup>
        ),
      },
      {
        type: "comp",
        label: "Calendar",
        refs: ["cossui"],
        render: <Calendar mode="single" captionLayout="dropdown" />,
      },
      {
        type: "comp",
        label: "Card",
        refs: ["shadcnui"],
        render: (
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>
                <LogInIcon /> Login to your account Lorem ipsum dolor, sit amet
                consectetur adipisicing elit.
              </CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
              <CardAction>
                <Button variant="link">Sign Up</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </CardFooter>
          </Card>
        ),
      },
      {
        type: "comp",
        label: "Carousel",
        refs: ["shadcnui"],
        render: (
          <Carousel className="w-full max-w-lg">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <span className="text-4xl font-semibold">
                          {index + 1}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ),
      },
      {
        type: "comp",
        label: "Chart",
        refs: ["shadcnui"],
        render: "To Do",
        variants: [
          { label: "Area Chart", render: "-x-" },
          { label: "Bar Chart", render: "-x-" },
          { label: "Pie Chart", render: "-x-" },
        ],
      },
      {
        type: "comp",
        label: "Checkbox",
        refs: ["shadcnui"],
        render: (
          <Label asCard>
            <Checkbox defaultChecked />
            <div className="flex flex-col gap-1">
              <p>Enable notifications</p>
              <p className="text-muted-foreground text-xs">
                You can enable or disable notifications at any time.
              </p>
            </div>
          </Label>
        ),
      },
      {
        type: "comp",
        label: "Collapsible",
        refs: ["cossui"],
        render: (
          <Collapsible className="flex w-87.5 flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-sm font-semibold">Order #4189</h4>
              <CollapsibleTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDownIcon />
                    <span className="sr-only">Toggle details</span>
                  </Button>
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">Shipped</span>
            </div>
            <CollapsiblePanel className="flex flex-col gap-2">
              <div className="rounded-md border px-4 py-2 text-sm">
                <p className="font-medium">Shipping address</p>
                <p className="text-muted-foreground">
                  100 Market St, San Francisco
                </p>
              </div>
              <div className="rounded-md border px-4 py-2 text-sm">
                <p className="font-medium">Items</p>
                <p className="text-muted-foreground">2x Studio Headphones</p>
              </div>
            </CollapsiblePanel>
          </Collapsible>
        ),
      },
      { type: "comp", label: "Column" },
      {
        type: "comp",
        label: "Combobox",
        refs: ["cossui"],
        render: (
          <div className="w-full max-w-lg">
            <ComboboxExample />
          </div>
        ),
      },
      { type: "comp", label: "Command", refs: ["cossui"] },
      {
        type: "comp",
        label: "Detail List",
        render: (
          <div className="grid w-full max-w-sm gap-y-4">
            <DetailList
              data={[
                { label: "Email", content: "example@example.ex" },
                {
                  label: "Status",
                  content: (
                    <Badge variant="outline" className="relative">
                      <div className="bg-success size-2 rounded-full" /> Active
                    </Badge>
                  ),
                },
                {
                  label: "Time",
                  content: [
                    { label: "Updated At" },
                    { label: "Created At", content: "3 days ago." },
                  ],
                },
              ]}
            />
          </div>
        ),
      },
      {
        type: "comp",
        label: "Dialog",
        refs: ["cossui"],
        render: (
          <Dialog>
            <form className="w-fit">
              <DialogTrigger render={<Button variant="outline" />}>
                Open Dialog
              </DialogTrigger>
              <DialogPopup>
                <DialogHeader>
                  <DialogTitle>
                    <UserRoundIcon /> Edit profile
                  </DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when
                    you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <DialogPanel>
                  <Fieldset>
                    <Field>
                      <FieldLabel htmlFor="name-1">Name</FieldLabel>
                      <Input
                        id="name-1"
                        name="name"
                        defaultValue="Pedro Duarte"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="name-1">Name</FieldLabel>
                      <Input
                        id="username-1"
                        name="username"
                        defaultValue="@peduarte"
                      />
                    </Field>
                  </Fieldset>
                </DialogPanel>
                <DialogFooter>
                  <DialogClose
                    render={<Button variant="outline">Cancel</Button>}
                  />
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogPopup>
            </form>
          </Dialog>
        ),
      },
      {
        type: "comp",
        label: "Drawer",
        refs: ["cossui"],
        render: (
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>
              Open drawer
            </DrawerTrigger>
            <DrawerPopup showBar>
              <DrawerHeader className="text-center">
                <DrawerTitle>
                  <BellIcon /> Notifications
                </DrawerTitle>
                <DrawerDescription>
                  This is the description of the drawer.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="justify-center sm:justify-center">
                <DrawerClose render={<Button variant="outline" />}>
                  Close
                </DrawerClose>
              </DrawerFooter>
            </DrawerPopup>
          </Drawer>
        ),
      },
      {
        type: "comp",
        label: "Empty",
        refs: ["shadcnui", "cossui"],
        render: (
          <Button
            size="icon-sm"
            variant="link"
            render={
              <Link href="/404">
                See <LinkSpinner icon={{ base: <ArrowRightIcon /> }} />
              </Link>
            }
          />
        ),
      },
      {
        type: "comp",
        label: "Fallback",
        refs: [{ url: "/#components-alert" }],
        render: (
          <>
            <LoadingFallback
              variant="frame"
              containerClassName="h-24 w-full max-w-lg rounded-xl border"
            />

            <ErrorFallback
              error={JSON.stringify(
                {
                  success: false,
                  message: "Something is wrong!",
                },
                null,
                2,
              )}
              className="w-full max-w-lg"
            />
          </>
        ),
      },
      { type: "comp", label: "Field", refs: ["cossui"] },
      {
        type: "comp",
        label: "Input",
        refs: ["cossui"],
        render: (
          <>
            <div className="flex gap-2">
              <Input size="sm" placeholder="Enter " />
              <Button size="icon-sm">
                <SendIcon />
              </Button>
            </div>

            <div className="flex gap-2">
              <Input placeholder="Enter " />
              <Button size="icon">
                <SendIcon />
              </Button>
            </div>

            <div className="flex gap-2">
              <Input size="lg" placeholder="Enter " />
              <Button size="icon-lg">
                <SendIcon />
              </Button>
            </div>
          </>
        ),
      },
      {
        type: "comp",
        label: "Input Group",
        refs: ["cossui"],
        render: (
          <>
            <div className="w-full max-w-sm">
              <InputGroup>
                <InputGroupInput size="sm" placeholder="Search..." />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Button size="icon-xs" variant="outline">
                    <ChevronsUpDownIcon />
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="w-full max-w-sm">
              <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Badge variant="outline">
                    <ChevronsUpDownIcon />
                  </Badge>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </>
        ),
      },
      { type: "comp", label: "Item", refs: ["shadcnui"] },
      { type: "comp", label: "Kbd", refs: ["cossui"] },
      { type: "comp", label: "Label", refs: ["shadcnui"] },
      {
        type: "comp",
        label: "Menu",
        refs: ["cossui"],
        render: (
          <Menu>
            <MenuTrigger render={<Button variant="outline" />}>
              Open menu
            </MenuTrigger>
            <MenuPopup>
              <MenuGroup>
                <MenuGroupLabel>Playback</MenuGroupLabel>
                <MenuItem>
                  <PlayIcon /> Play
                  <MenuShortcut>⌘P</MenuShortcut>
                </MenuItem>
                <MenuItem disabled>
                  <PauseIcon /> Pause
                  <MenuShortcut>⇧⌘P</MenuShortcut>
                </MenuItem>
                <MenuItem>
                  <SkipBackIcon /> Previous
                  <MenuShortcut>⌘[</MenuShortcut>
                </MenuItem>
                <MenuItem>
                  <SkipForwardIcon /> Next
                  <MenuShortcut>⌘]</MenuShortcut>
                </MenuItem>
              </MenuGroup>
              <MenuSeparator />
              <MenuCheckboxItem>Shuffle</MenuCheckboxItem>
              <MenuCheckboxItem>Repeat</MenuCheckboxItem>
              <MenuCheckboxItem disabled>Enhanced Audio</MenuCheckboxItem>
              <MenuSeparator />
              <MenuGroup>
                <MenuGroupLabel>Sort by</MenuGroupLabel>
                <MenuRadioGroup>
                  <MenuRadioItem value="artist">Artist</MenuRadioItem>
                  <MenuRadioItem value="album">Album</MenuRadioItem>
                  <MenuRadioItem value="title">Title</MenuRadioItem>
                </MenuRadioGroup>
              </MenuGroup>
              <MenuSeparator />
              <MenuCheckboxItem variant="switch">Auto save</MenuCheckboxItem>
              <MenuSeparator />
              <MenuSub>
                <MenuSubTrigger>Add to Playlist</MenuSubTrigger>
                <MenuSubPopup>
                  <MenuItem>Jazz</MenuItem>
                  <MenuSub>
                    <MenuSubTrigger>Rock</MenuSubTrigger>
                    <MenuSubPopup>
                      <MenuItem>Hard Rock</MenuItem>
                      <MenuItem>Soft Rock</MenuItem>
                      <MenuItem>Classic Rock</MenuItem>
                      <MenuSeparator />
                      <MenuItem>Metal</MenuItem>
                      <MenuItem>Punk</MenuItem>
                      <MenuItem>Grunge</MenuItem>
                      <MenuItem>Alternative</MenuItem>
                      <MenuItem>Indie</MenuItem>
                      <MenuItem>Electronic</MenuItem>
                    </MenuSubPopup>
                  </MenuSub>
                  <MenuItem>Pop</MenuItem>
                </MenuSubPopup>
              </MenuSub>
              <MenuSeparator />
              <MenuItem variant="destructive">
                <TrashIcon /> Delete
                <MenuShortcut>
                  {formatForDisplay("Control+Delete")}
                </MenuShortcut>
              </MenuItem>
            </MenuPopup>
          </Menu>
        ),
      },
      {
        type: "comp",
        label: "Number Field",
        refs: ["cossui"],
        render: (
          <NumberField defaultValue={0} className="w-full max-w-sm">
            <NumberFieldScrubArea label="Quantity" />
            <NumberFieldGroup>
              <NumberFieldInput />
              <NumberFieldDecrement />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          </NumberField>
        ),
      },
      {
        type: "comp",
        label: "Popover",
        refs: ["cossui"],
        render: (
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              Open Popover
            </PopoverTrigger>
            <PopoverPopup>
              <div className="mb-4">
                <PopoverTitle className="text-base">
                  Send us feedback
                </PopoverTitle>
                <PopoverDescription>
                  Let us know how we can improve.
                </PopoverDescription>
              </div>
              <form>
                <Field>
                  <Textarea
                    aria-label="Send feedback"
                    id="feedback"
                    placeholder="How can we improve?"
                  />
                </Field>
                <Button type="submit">Send feedback</Button>
              </form>
            </PopoverPopup>
          </Popover>
        ),
      },
      { type: "comp", label: "Progress", refs: ["shadcnui"] },
      { type: "comp", label: "Radio Group", refs: ["shadcnui"] },
      { type: "comp", label: "Scroll Area", refs: ["cossui"] },
      {
        type: "comp",
        label: "Select",
        refs: ["cossui"],
        render: () => {
          const frontend = [
            { label: "Next.js", value: "next" },
            { label: "Vite", value: "vite" },
            { label: "Astro", value: "astro" },
          ];

          const backend = [
            { label: "Express", value: "express" },
            { label: "NestJS", value: "nestjs" },
            { label: "Fastify", value: "fastify" },
            { label: "Django", value: "django" },
            { label: "Flask", value: "flask" },
            { label: "Rails", value: "rails" },
          ];

          return (
            <div className="w-full max-w-sm">
              <Select
                aria-label="Select framework"
                items={[...frontend, ...backend]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectPopup>
                  <SelectGroup>
                    <SelectGroupLabel>Frontend</SelectGroupLabel>
                    {frontend.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectGroupLabel>Backend</SelectGroupLabel>
                    {backend.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectPopup>
              </Select>
            </div>
          );
        },
      },
      { type: "comp", label: "Separator", refs: ["shadcnui"] },
      { type: "comp", label: "Skeleton", refs: ["cossui"] },
      { type: "comp", label: "Slider", refs: ["cossui"] },
      { type: "comp", label: "Spinner" },
      {
        type: "comp",
        label: "Stepper",
        refs: ["reui"],
        render: <StepperExample />,
      },
      { type: "comp", label: "Switch", refs: ["shadcnui"] },
      {
        type: "comp",
        label: "Table",
        refs: ["cossui"],
        render: () => {
          return (
            <Table>
              <TableCaption>A list of current projects.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Budget</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Website Redesign
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-emerald-500"
                      />
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell>Frontend Team</TableCell>
                  <TableCell className="text-right">$12,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Mobile App</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <span
                        aria-hidden="true"
                        className="bg-muted-foreground/64 size-1.5 rounded-full"
                      />
                      Unpaid
                    </Badge>
                  </TableCell>
                  <TableCell>Mobile Team</TableCell>
                  <TableCell className="text-right">$8,750</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">API Integration</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-amber-500"
                      />
                      Pending
                    </Badge>
                  </TableCell>
                  <TableCell>Backend Team</TableCell>
                  <TableCell className="text-right">$5,200</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Database Migration
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-emerald-500"
                      />
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell>DevOps Team</TableCell>
                  <TableCell className="text-right">$3,800</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">User Dashboard</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-emerald-500"
                      />
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell>UX Team</TableCell>
                  <TableCell className="text-right">$7,200</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Security Audit</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <span
                        aria-hidden="true"
                        className="size-1.5 rounded-full bg-red-500"
                      />
                      Failed
                    </Badge>
                  </TableCell>
                  <TableCell>Security Team</TableCell>
                  <TableCell className="text-right">$2,100</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total Budget</TableCell>
                  <TableCell className="text-right">$39,550</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          );
        },
      },
      { type: "comp", label: "Tabs", refs: ["cossui"] },
      {
        type: "comp",
        label: "Textarea",
        refs: ["cossui"],
        render: (
          <div className="w-full max-w-sm">
            <Textarea placeholder="Type your message here" />
          </div>
        ),
      },
      {
        type: "comp",
        label: "Timeline",
        refs: ["reui"],
        render: (
          <Timeline defaultValue={2} className="w-full max-w-md">
            <TimelineItem step={1}>
              <TimelineHeader>
                <TimelineDate>March 2024</TimelineDate>
                <TimelineTitle>Project Initialized</TimelineTitle>
              </TimelineHeader>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineContent>
                Successfully set up the project repository and initial
                architecture.
              </TimelineContent>
            </TimelineItem>

            <TimelineItem step={2}>
              <TimelineHeader>
                <TimelineDate>April 2024</TimelineDate>
                <TimelineTitle>Beta Release</TimelineTitle>
              </TimelineHeader>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineContent>
                Launched the beta version for early testers and feedback.
              </TimelineContent>
            </TimelineItem>

            <TimelineItem step={3}>
              <TimelineHeader>
                <TimelineDate>June 2024</TimelineDate>
                <TimelineTitle>Official Launch</TimelineTitle>
              </TimelineHeader>
              <TimelineIndicator />
              <TimelineSeparator />
              <TimelineContent>
                The platform is now live for all users worldwide.
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        ),
      },
      {
        type: "comp",
        label: "Toast",
        refs: ["cossui"],
        render: <ToastExample />,
      },
      { type: "comp", label: "Toggle", refs: ["shadcnui"] },
      { type: "comp", label: "Toggle Group", refs: ["shadcnui"] },
      { type: "comp", label: "Tooltip", refs: ["cossui"] },
    ],
  },

  {
    icon: Layers2Icon,
    section: "Providers",
    content: [
      { type: "comp", label: "Dynamic Breadcrumb" },
      { type: "comp", label: "Global Shortcuts" },
      { type: "comp", label: "Layout" },
      { type: "comp", label: "Theme" },
    ],
  },

  {
    icon: WandSparklesIcon,
    section: "Effects",
    content: [
      {
        type: "comp",
        label: "Animate On View",
        render: (
          <>
            <AnimateOnView>From Bottom</AnimateOnView>

            <AnimateOnView initial={{ x: 0, y: -15 }} delay={0.5}>
              From Top
            </AnimateOnView>

            <AnimateOnView initial={{ x: 15, y: 0 }} delay={0.75}>
              From Right
            </AnimateOnView>

            <AnimateOnView initial={{ x: -15, y: 0 }} delay={1}>
              From Left
            </AnimateOnView>
          </>
        ),
      },
      { type: "comp", label: "Blur Fade", refs: ["magicui"] },
      {
        type: "comp",
        label: "Box Reveal",
        refs: ["magicui"],
        render: (
          <BoxReveal>
            <h1>Hello World</h1>
          </BoxReveal>
        ),
      },
      {
        type: "comp",
        label: "Ping",
        render: (
          <div className="relative aspect-square size-8 border">
            <Ping />
          </div>
        ),
      },
      { type: "comp", label: "Shimmer Text", refs: ["spellui"] },
      { type: "comp", label: "Shine Border", refs: ["magicui"] },
      { type: "comp", label: "Sticky Banner", refs: ["aceternityui"] },
      {
        type: "comp",
        label: "Text Morph",
        refs: [{ type: "external", url: "https://torph.lochie.me" }],
      },
    ],
  },

  {
    icon: ShapesIcon,
    section: "Backgrounds",
    content: [
      { type: "comp", label: "Grid Pattern", refs: ["magicui"] },
      { type: "comp", label: "Scales", refs: ["aceternityui"] },
    ],
  },

  {
    icon: BookSearchIcon,
    section: "Examples",
    content: [{ type: "comp", label: "Form", render: <FormExample /> }],
  },
];

const homeQuickSearch: QuickSearchGroup[] = docs.map((d) => {
  return {
    group: d.section,
    items: d.content
      .flatMap((c) => {
        if (c.label) {
          if (c.type === "text") console.log(c);
          const id = toCase(`${d.section}-${c.label}`, "kebab");

          const item = {
            type: "nav" as const,
            label: c.label,
            value: `/#${id}`,
          };

          const subContent =
            c.type === "comp" && !!c.variants?.length
              ? c.variants?.map((sc) => ({
                  type: "nav" as const,
                  label: `${c.label} / ${sc.label}`,
                  value: `/#${toCase(`${id}-${sc.label}`, "kebab")}`,
                  icon: <DotIcon className="text-muted-foreground" />,
                }))
              : null;

          return subContent ? [item, ...subContent] : [item];
        }

        return null;
      })
      .filter((v) => !!v),
  };
});

export default function Page() {
  return (
    <div className="relative [--header-height:48px]">
      {/* <ScrollToTopButton /> */}

      {/* Header */}
      <DocsSection
        containerClassName="fixed top-0 z-10 backdrop-blur-md"
        className="flex h-(--header-height) items-center justify-between gap-x-2 px-4"
        withIcon
      >
        <div className="flex items-center gap-x-2">
          {/* <Button size="icon-sm" variants="ghost" className="flex md:hidden">
            <SidebarOpenIcon />
          </Button> */}

          <PageTitle className="font-mono text-sm tracking-tight">
            <Link href="/">Next Starter - RvnS</Link>
          </PageTitle>
        </div>

        <div className="flex items-center gap-x-2">
          <QuickSearch
            type="group"
            data={[
              {
                group: "Navigate",
                items: [
                  { type: "nav", label: "Dashboard", value: "/dashboard" },
                ],
              },
              ...homeQuickSearch,
            ]}
            shortcuts={["Control+K", "Meta+K"]}
          />

          <Button
            size="sm"
            render={
              <Link href="/dashboard">
                <LinkSpinner /> Dashboard
              </Link>
            }
          />

          <Separator orientation="vertical" className="h-4" />

          <ThemeToggle align="end" size="icon-sm" />
        </div>
      </DocsSection>

      <DocsSection className="relative z-0 mt-(--header-height) flex md:border-0">
        {/* Sidebar */}
        <Scrollspy
          offset={48}
          className="sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))] basis-1/4 flex-col gap-y-8 overflow-y-auto border-x p-4 md:flex"
        >
          {docs.map(({ icon: Icon, section, content }, index) => (
            <div key={index} className="flex flex-col gap-y-3">
              <Label
                data-scrollspy-anchor={toCase(section, "kebab")}
                className="flex cursor-pointer items-center gap-x-2"
              >
                <Icon className="size-3.5" /> {section}
              </Label>

              <div className="flex flex-col gap-y-2">
                {content.map((c) => {
                  if (!c.label) return;
                  const id = toCase(`${section}-${c.label}`, "kebab");

                  return (
                    <Fragment key={id}>
                      <Link
                        href={`/#${id}`}
                        data-scrollspy-anchor={id}
                        className="group data-active:text-foreground text-muted-foreground text-sm data-active:font-medium"
                      >
                        <small className="link-group">{c.label}</small>
                      </Link>

                      {c.type === "comp" &&
                        c.variants &&
                        c.variants.map((sc) => {
                          const cvId = toCase(`${id}-${sc.label}`, "kebab");

                          return (
                            <Link
                              key={cvId}
                              href={`/#${cvId}`}
                              data-scrollspy-anchor={cvId}
                              className="group data-active:text-foreground hover:text-foreground text-muted-foreground flex items-center gap-x-2 text-sm data-active:font-medium"
                            >
                              <DotIcon className="size-3.5" />
                              <small className="link-group">{sc.label}</small>
                            </Link>
                          );
                        })}
                    </Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </Scrollspy>

        {/* Content */}
        <div className="flex flex-col md:basis-3/4 md:border-r">
          <div className="relative flex justify-center border-b py-4">
            <R className="size-19" />
            <Scales />
          </div>

          {docs.map(({ icon: Icon, section, content }, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <ScalesWrapper
                  containerClassName="h-8"
                  className="h-8 border-y"
                />
              )}

              <div
                id={toCase(section, "kebab")}
                className="group/home-content flex flex-col"
              >
                <div className="relative p-4">
                  <PageTitle as="h2" className="flex items-center gap-x-2">
                    <Icon /> {section}
                  </PageTitle>

                  <PlusIcon className="text-muted-foreground absolute -top-2 -right-2 hidden size-4 md:flex" />
                  <PlusIcon className="text-muted-foreground absolute -top-2 -left-2 hidden size-4 md:flex" />
                  <PlusIcon className="text-muted-foreground absolute -right-2 -bottom-2 hidden size-4 md:flex" />
                  <PlusIcon className="text-muted-foreground absolute -bottom-2 -left-2 hidden size-4 md:flex" />
                </div>

                {content.map((c, i) => {
                  const id = toCase(`${section}-${c.label ?? i}`, "kebab");

                  if (c.type === "comp") {
                    return (
                      <DocsContentWrapper
                        key={id}
                        id={id}
                        data={c}
                        className={cn((c.render || c.variants) && "pb-6")}
                      >
                        {c.render && (
                          <div className="flex flex-col items-center gap-4">
                            {typeof c.render === "function"
                              ? c.render()
                              : c.render}
                          </div>
                        )}

                        {c.variants && (
                          <>
                            <Label>Variants</Label>

                            {c.variants.map((sc) => {
                              const cvId = toCase(`${id}-${sc.label}`, "kebab");
                              return (
                                <Fragment key={cvId}>
                                  <div
                                    id={cvId}
                                    className="flex scroll-m-12 items-center gap-x-1 text-sm"
                                  >
                                    <DotIcon className="size-4" /> {sc.label}
                                  </div>

                                  <div className="flex items-center justify-center">
                                    {sc.render}
                                  </div>
                                </Fragment>
                              );
                            })}
                          </>
                        )}
                      </DocsContentWrapper>
                    );
                  }

                  return (
                    <DocsContentWrapper
                      key={id}
                      id={id}
                      data={c}
                      className={cn(!!c.label && !!c.render && "pb-6")}
                    >
                      {c.render && (
                        <div className="text-muted-foreground flex flex-col gap-4 text-sm">
                          {typeof c.render === "function"
                            ? c.render()
                            : c.render}
                        </div>
                      )}
                    </DocsContentWrapper>
                  );
                })}
              </div>
            </Fragment>
          ))}

          <ScalesWrapper containerClassName="h-8" className="h-8 border-y" />

          <DocsSection className="flex items-center justify-center px-4 py-3 text-center">
            <FooterNote />
          </DocsSection>
        </div>
      </DocsSection>
    </div>
  );
}
