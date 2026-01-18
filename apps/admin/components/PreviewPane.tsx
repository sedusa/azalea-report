'use client';

import { useState } from 'react';
import { LuMonitor, LuTablet, LuSmartphone } from 'react-icons/lu';
import type { Issue, Section } from '@azalea/shared/types';

interface PreviewPaneProps {
  issue: Issue;
  sections: Section[];
}

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export function PreviewPane({ issue, sections }: PreviewPaneProps) {
  const [viewport, setViewport] = useState<ViewportSize>('desktop');

  const viewportStyles = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto',
    mobile: 'max-w-[375px] mx-auto',
  };

  const visibleSections = sections.filter((s) => s.visible);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Preview</h3>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewport('desktop')}
            className={`
              p-2 rounded transition-colors
              ${viewport === 'desktop' ? 'bg-white shadow-sm text-azalea-green' : 'text-gray-600 hover:text-gray-900'}
            `}
            title="Desktop view"
          >
            <LuMonitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`
              p-2 rounded transition-colors
              ${viewport === 'tablet' ? 'bg-white shadow-sm text-azalea-green' : 'text-gray-600 hover:text-gray-900'}
            `}
            title="Tablet view"
          >
            <LuTablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`
              p-2 rounded transition-colors
              ${viewport === 'mobile' ? 'bg-white shadow-sm text-azalea-green' : 'text-gray-600 hover:text-gray-900'}
            `}
            title="Mobile view"
          >
            <LuSmartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`${viewportStyles[viewport]} transition-all duration-300`}>
          {/* Banner Preview */}
          <div className="bg-azalea-peach text-center py-12 px-6 rounded-lg mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {issue.bannerTitle || 'AZALEA REPORT'}
            </h1>
            <p className="text-lg text-gray-700">
              {issue.title || 'Untitled Issue'}
            </p>
            {issue.bannerDate && (
              <p className="text-sm text-gray-600 mt-2">
                {new Date(issue.bannerDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Sections Preview */}
          {visibleSections.length > 0 ? (
            <div className="space-y-8">
              {visibleSections.map((section) => (
                <div
                  key={section._id}
                  className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                >
                  <div className="mb-4">
                    <span className="text-xs font-medium text-azalea-green uppercase tracking-wide">
                      {section.type}
                    </span>
                  </div>

                  {/* Section content preview */}
                  <div className="prose max-w-none">
                    {section.data.sectionTitle && (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {section.data.sectionTitle as string}
                      </h2>
                    )}

                    {/* Simple content preview */}
                    {section.data.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: section.data.content as string,
                        }}
                      />
                    )}

                    {section.data.name && (
                      <p className="font-semibold text-lg">
                        {section.data.name as string}
                      </p>
                    )}

                    {section.data.title && (
                      <h3 className="text-xl font-semibold">
                        {section.data.title as string}
                      </h3>
                    )}

                    {section.data.description && (
                      <p className="text-gray-600">
                        {section.data.description as string}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    Full section rendering will use components from packages/sections
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No visible sections</p>
              <p className="text-sm mt-2">Add sections to see preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
