import React from 'react';
import { Typography } from '@strapi/design-system';

import { ListViewTableCell } from '../components';
import { parseUrl, pluginId } from '../utils';

const addPreviewColumn = ( { displayedHeaders, layout }, pluginConfig ) => {
  const { contentTypes } = pluginConfig;
  const match = contentTypes?.find( type => type.uid === layout.contentType.uid );
  const isSupportedType = !! match;

  // Do nothing if this feature is not a supported type for the preview button.
  if ( ! isSupportedType ) {
    return {
      displayedHeaders,
      layout,
    };
  }

  return {
    displayedHeaders: [
      ...displayedHeaders,
      {
        key: '__preview_key__',
        fieldSchema: {
          type: 'string',
        },
        metadatas: {
          label: 'Preview Link',
          searchable: false,
          sortable: false,
        },
        name: 'preview',
        cellFormatter: data => {
          const hasDraftAndPublish = layout.contentType.options.draftAndPublish === true;
          const isDraft = hasDraftAndPublish && ! data.publishedAt;
          const stateConfig = isSupportedType && match[ isDraft ? 'draft' : 'published' ];
          const url = parseUrl( stateConfig, data );

          if ( ! url ) {
            return null;
          }

          return (
            <ListViewTableCell isDraft={ isDraft } url={ url } />
          );
        },
      },
    ],
    layout,
  };
}

export default addPreviewColumn;