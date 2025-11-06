import { clientEnv } from "@/env/client";

/**
 * Creates a consistent page title with site name
 */
export const createPageTitle = (pageTitle: string) => {
	return `${pageTitle} | ${clientEnv.VITE_SITE_NAME}`;
};

/**
 * Gets the base URL for the application
 */
export const getBaseUrl = () => {
	return clientEnv.VITE_WEBSITE_URL
		? `https://${clientEnv.VITE_WEBSITE_URL}`
		: "http://localhost:3000";
};

/**
 * Common metadata patterns for different page types
 */
export const getMetaDefaults = () => {
	return {
		// For pages that should not be indexed (account, checkout, etc.)
		private: [
			{
				name: "robots",
				content: "noindex, nofollow",
			},
		],

		// For public pages that should be indexed
		public: [
			{
				name: "robots",
				content: "index, follow",
			},
		],

		// Basic Open Graph type override for non-website pages
		webpage: [
			{
				property: "og:type",
				content: "article",
			},
		],
	};
};

/**
 * Creates a simple meta array with just title and description
 * Everything else inherits from root layout
 */
export const createBasicMeta = (
	title: string,
	description: string,
	isPrivate = false,
) => {
	const defaults = getMetaDefaults();

	return [
		{
			title: createPageTitle(title),
		},
		{
			name: "description",
			content: description,
		},
		...(isPrivate ? defaults.private : defaults.public),
	];
};

/**
 * Enhanced meta for e-commerce pages (products, collections)
 */
export const createEcommerceMeta = (
	title: string,
	description: string,
	imageUrl?: string,
	additionalMeta: Array<{
		name?: string;
		property?: string;
		content: string;
	}> = [],
) => {
	const pageTitle = createPageTitle(title);

	return [
		{
			title: pageTitle,
		},
		{
			name: "description",
			content: description,
		},
		{
			name: "robots",
			content: "index, follow",
		},
		// Override Open Graph title and description (inherits the rest)
		{
			property: "og:title",
			content: pageTitle,
		},
		{
			property: "og:description",
			content: description,
		},
		// Add image if provided
		...(imageUrl
			? [
					{
						property: "og:image",
						content: imageUrl,
					},
					{
						name: "twitter:image",
						content: imageUrl,
					},
				]
			: []),
		// Add any additional meta tags
		...additionalMeta,
	];
};

/**
 * Creates structured data for different content types
 */
export const createStructuredData = {
	breadcrumb: (items: Array<{ name: string; url: string }>) => ({
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	}),

	product: (product: any, activeChannel: any, baseUrl: string) => ({
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description:
			product.description ||
			`${product.name} - Available at ${clientEnv.VITE_SITE_NAME}`,
		url: `${baseUrl}/product/${product.slug}`,
		sku: product.id,
		brand: {
			"@type": "Brand",
			name: clientEnv.VITE_SITE_NAME,
		},
		offers: {
			"@type": "AggregateOffer",
			availability: product.enabled
				? "https://schema.org/InStock"
				: "https://schema.org/OutOfStock",
			priceCurrency: activeChannel.defaultCurrencyCode,
		},
	}),
};
