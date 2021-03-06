/**
 * PluginConstructor
 */
export interface PluginConstructor {
    new (
        document: Schema,
        graphqldocPackage: any,
        projectPackage: any
    ): PluginInterface;
}

/**
 * PluginInterface
 */
export interface PluginInterface {

    /**
     * Return  section elements that is going to be
     * inserted into the side navigation bar.
     *
     * @example plain javascript:
     * [
     *  {
     *      title: 'Schema',
     *      items: [
     *          {
     *              text: 'Query',
     *              href: './query.doc.html',
     *              isActive: false
     *          },
     *          // ...
     *  }
     *  // ...
     * ]
     *
     * @example with graphqldoc utilities:
     * import { NavigationSection, NavigationItem } from 'graphqldoc/lib/utility';
     *
     * [
     *  new NavigationSection('Schema', [
     *      new NavigationItem('Query', ./query.doc.html', false)
     *  ]),
     *  // ...
     * ]
     *
     * @param {string} [buildForType] -
     *  the name of the element for which the navigation section is being generated,
     *  if it is `undefined it means that the index of documentation is being generated
     */
    getNavigations?: (buildForType?: string) => NavigationSectionInterface[] | PromiseLike<NavigationSectionInterface[]>;

    /**
     * Return  section elements that is going to be
     * inserted into the main section.
     *
     * @example plain javascript:
     * [
     *  {
     *      title: 'GraphQL Schema definition',
     *      description: 'HTML'
     *  },
     *  // ...
     * ]
     *
     * @example with graphqldoc utilities:
     * import { DocumentSection } from 'graphqldoc/lib/utility';
     *
     * [
     *  new DocumentSection('GraphQL Schema definition', 'HTML'),
     *  // ...
     * ]
     *
     * @param {string} [buildForType] -
     *  the name of the element for which the navigation section is being generated,
     *  if it is `undefined it means that the index of documentation is being generated
     *
     */
    getDocuments?: (buildForType?: string) => DocumentSectionInterface[] | PromiseLike<DocumentSectionInterface[]>;

    /**
     * Return a list of html tags that is going to be
     * inserted into the head tag of each page.
     *
     * @example
     *  [
     *      '<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>',
     *      '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
     *  ]
     */
    getHeaders?: (buildForType?: string) => string[] | PromiseLike<string[]>;

    /**
     * Return a list of absolute path to files that is going to be
     * copied to the assets directory.
     *
     * Unlike the previous methods that are executed each time that a page generated,
     * this method is called a single time before starting to generate the documentation
     *
     * @example
     * [
     *  '/local/path/to/my-custom-style.css',
     *  '/local/path/to/my-custom-image.png',
     * ]
     *
     * there's will be copied to
     * /local/path/to/my-custom-style.css -> [OUTPUT_DIRETORY]/assets/my-custom-style.css
     * /local/path/to/my-custom-image.png -> [OUTPUT_DIRETORY]/assets/my-custom-image.png
     *
     * If you want to insert styles or scripts to the documentation,
     * you must combine this method with getHeaders
     *
     * @example
     * getAssets(): ['/local/path/to/my-custom-style.css']
     * getHeaders(): ['<link href="assets/my-custom-style.css" rel="stylesheet">']
     */
    getAssets?: () => string[] | PromiseLike<string[]>;
}

export interface PluginImplementedInterface {
    document: Schema;
    url: refToUrl;
    queryType: SchemaType | null;
    mutationType: SchemaType | null;
    subscriptionType: SchemaType | null;
}

export interface NavigationSectionInterface {
    title: string;
    items: NavigationItemInterface[];
}

export interface NavigationItemInterface {
    href: string;
    text: string;
    isActive: boolean;
}

export interface DocumentSectionInterface {
    title: string;
    description: string;
}

/**
 * Convert TypeRef
 */
type refToUrl = (typeName: TypeRef) => string;

/**
 * Introspection types
 */
type RawIntrospection = {
    __schema: Schema
}

type WrappedIntrospection = {
    data: RawIntrospection
};

type Introspection = RawIntrospection | WrappedIntrospection;

type Schema = {
    queryType: Description,
    mutationType: Description,
    subscriptionType: Description,
    types: SchemaType[],
    directives: Directive[]
}

type Description = {
    name: string,
    description: string,
    kind?: string,
}

type Deprecation = {
    isDeprecated: boolean,
    deprecationReason: string,
}

type SchemaType = Description & {
    fields: Field[]
    inputFields: InputValue[],
    interfaces: TypeRef[],
    enumValues: EnumValue[],
    possibleTypes: TypeRef[],
}

type Directive = Description & {
    locations: string[],
    args: InputValue[]
}

type EnumValue = Description & Deprecation;

type InputValue = Description & {
    type: TypeRef,
    defaultValue: string | number | null,
}

type Field = Description & Deprecation & {
    args: InputValue[],
    type: TypeRef
}

type TypeRef = Description & {
    ofType?: TypeRef
}

export interface SchemaLoader {
    (options: any): Promise<Schema>;
}
