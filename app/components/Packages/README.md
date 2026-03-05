# Components in the `packages` folder

These components can be transferred across Next.js projects with minimal dependencies.

Some components rely on a redux variable `{ isModalOpen }` or `{ isModalVisible }` defined in this project. This variable and its functionality can be reproduced by copying the `redux` directory into your project.

There are clones of components from the `govuk-react` [npm package](https://www.npmjs.com/package/govuk-react). This is so there is a single source of truth for each component. These components can be identified where a component from the package is being imported and then exported with custom props e.g. `Heading`.

Each component is packaged with its own .tsx, CSS module and Jest/RTL unit test suite where applicable.

<hr/>

## `govuk-react` clones

### H1-H6

#### Props

```typescript
children: React.ReactNode;
className?: string;
"data-testid"?: string;
```

Renders semantic HTML title components

<br/>

### Main

#### Props

```typescript
children: React.ReactNode;
"data-testid"?: string;
```

Renders the [GDS width container](https://govuk-react.github.io/govuk-react/?path=/docs/main--docs)

<br/>

### LabelText

### Props

```typescript
children: React.ReactNode;
className?: string;
```

Renders the [GDS LabelText component](https://govuk-react.github.io/govuk-react/?path=/docs/label-text--docs)

<br/>

### Button

#### Props

```typescript
icon?: React.ReactNode;
buttonColour?: string;
buttonHoverColour?: string;
buttonShadowColour?: string;
buttonTextColour?: string;
className?: string;
id?: string;
tabIndex?: number;
start?: boolean;
onClick?: Function;
"data-testid"?: string;
"aria-label"?: string;
children: React.ReactNode;
disabled?: boolean;
```

Renders the [GDS Button component](https://govuk-react.github.io/govuk-react/?path=/docs/button--docs)

<br/>

### Link

#### Props

```typescript
children: React.ReactNode;
href?: string;
target?: string;
id?: string;
className?: string;
role?: string;
tabIndex?: number;
onClick?: Function;
onKeyDown?: Function;
"aria-label"?: string;
"aria-hidden"?: boolean;
"data-testid"?: string;
```

Renders the [GDS Link Component](https://govuk-react.github.io/govuk-react/?path=/docs/link--docs)

<br/>

### WarningText

#### Props

```typescript
children: React.ReactNode;
"data-testid"?: string;
```

Renders the [GDS WarningText component](https://govuk-react.github.io/govuk-react/?path=/docs/warning-text--docs)

<br/>

### Paragraph

#### Props

```typescript
children: string;
className?: string;
tabIndex?: number;
"aria-hidden"?: boolean;
```

Renders the [GDS Paragraph component](https://govuk-react.github.io/govuk-react/?path=/docs/paragraph--docs)

<br/>

### InsetText

#### Props

```typescript
children: React.ReactNode;
className?: string;
"data-testid"?: string;
```

Renders the [GDS InsetText component](https://govuk-react.github.io/govuk-react/?path=/docs/inset-text--docs)

<br/>

### UnorderedList

#### Props

```typescript
children: React.ReactNode;
className?: string;
"data-testid"?: string;
```

Renders the [GDS UnorderedList component](https://govuk-react.github.io/govuk-react/?path=/docs/unordered-list--docs)

<br/>

### ListItem

#### Props

```typescript
children: React.ReactNode;
className?: string;
"data-testid"?: string;
```

Renders the [GDS ListItem component](https://govuk-react.github.io/govuk-react/?path=/docs/list-item--docs)

<br/>

### BackLink

#### Props

```typescript
"data-testid"?: string;
"aria-label"?: string;
role?: string;
tabIndex?: number;
onClick?: Function;
className?: string;
children: React.ReactNode;
```

Renders the [GDS BackLink component](https://govuk-react.github.io/govuk-react/?path=/docs/back-link--docs)

<br/>

### Heading

#### Props

```typescript
id?: string;
className?: string;
"data-testid"?: string;
"aria-label"?: string;
tabIndex?: number;
role?: string;
style?: { [key: string]: string } | {};
children: React.ReactNode;
```

Renders the [GDS Heading component](https://govuk-react.github.io/govuk-react/?path=/docs/heading--docs)

<br/>

### SectionBreak

#### Props

```typescript
visible: boolean;
level: "MEDIUM" | "LARGE";
```

Renders the [GDS SectionBreak component](https://govuk-react.github.io/govuk-react/?path=/docs/section-break--docs)

<br/>
<hr/>
<br/>

## Non `govuk-react` clones

### Header

#### Props

```typescript
isModalOpen: boolean | undefined;
```

Renders a header with a black background and white text

### Footer

#### Props

```typescript
isModalOpen: boolean | undefined;
pathname: string;
```

Renders a grey footer (with no official crest) and 2 links (number of links can be changed)

### Card

#### Props

```typescript
text: string;
onClick: Function;
```

Renders a white rectangle with blue text and a bottom blue border

### InputError

#### Props

```typescript
type: "charcount" | "invalidchar" | "blank";
query?: string;
charLimit: number;
```

Renders a GDS-style error message with a left red border. Uses an error map which can be modified along with the `type` prop for custom error messages

### Redirect

#### Props

```typescript
none;
```

This component does not return any HTML/TSX/JSX. It is used for route authentication and runs on every render of a new page/screen. The condition for route pushing back to the home/landing/login page can be changed within the component.

### Typing

#### Props

```typescript
none;
```

This component renders a typing animation as 3 rounded bubbles in a rectangle.

### Modal

#### Props

```typescript
heading: string;
confirm: {
  text: string;
  action: Function;
}
closeText: string;
type: "standard" | "danger";
```

This component renders an accessible modal component. This is heavily customisable through props. This component does have a reliance on a redux state function `{ setModalVisible }` which will dispatch when the modal is closed to reset the modal visibility. This is so the tabIndex attribute on other components in the app can be updated appropriately so the modal focus trap works to keep this component accessible.
