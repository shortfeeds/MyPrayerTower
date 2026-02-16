import { Thing, WithContext, Article, BreadcrumbList, FAQPage, HowTo } from 'schema-dts';

interface JsonLdProps<T extends Thing> {
    data: WithContext<T>;
}

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function ArticleJsonLd(props: JsonLdProps<Article>) {
    return <JsonLd<Article> {...props} />;
}

export function BreadcrumbJsonLd(props: JsonLdProps<BreadcrumbList>) {
    return <JsonLd<BreadcrumbList> {...props} />;
}

export function FaqJsonLd(props: JsonLdProps<FAQPage>) {
    return <JsonLd<FAQPage> {...props} />;
}

export function HowToJsonLd(props: JsonLdProps<HowTo>) {
    return <JsonLd<HowTo> {...props} />;
}
