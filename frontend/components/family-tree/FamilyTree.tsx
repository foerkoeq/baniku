// start of frontend/components/family-tree/FamilyTree.tsx
'use client';
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Tree from 'react-d3-tree';
import { useZoom } from './hooks/useZoom';
import { usePan } from './hooks/usePan';
import useCenteredTree from './hooks/useCenteredTree';
import TreeNode from './TreeNode';
import MiniMap from './MiniMap';
import Button from '../ui/button';
import Tooltip from '../ui/Tooltip';
import Modal from '../ui/Modal';
import EmptyTreeGuide from './EmptyTreeGuide';
import IconPlus from '../icon/icon-plus';
import IconMinus from '../icon/icon-minus';
import IconRefresh from '../icon/icon-refresh';
import { FamilyTreeProps, TreeNodeData, NodeClickData, UserRole } from './types';
import { Role, hasAccessLevel } from '@/types/role';

// Gunakan komponen yang sudah ada untuk zoom in/out
const IconZoomIn = IconPlus;
const IconZoomOut = IconMinus;

// Komponen untuk state kosong (tidak ada data sama sekali)
const EmptyTreeState: React.FC<{ 
  role: UserRole; 
  onAddClick?: () => void;
  onShowGuide?: () => void;
}> = ({ role, onAddClick, onShowGuide }) => {
  const getMessage = () => {
    switch (role) {
      case 'SUPER_ADMIN':
        return {
          title: 'Silsilah Bani Belum Ada',
          message: 'Klik tombol plus untuk menambahkan data keluarga awal',
          canAdd: true
        };
      case 'ADMIN_BANI':
        return {
          title: 'Menunggu Data Awal',
          message: 'Super Admin belum menambahkan data keluarga awal',
          canAdd: false
        };
      case 'ADMIN_KELUARGA':
        return {
          title: 'Menunggu Data Awal',
          message: 'Super Admin atau Admin Bani belum menambahkan data keluarga awal',
          canAdd: false
        };
      case 'MEMBER':
        return {
          title: 'Data Belum Tersedia',
          message: 'Menunggu Super Admin dan Admin Bani menambahkan data keluarga',
          canAdd: false
        };
      default:
        return {
          title: 'Akses Tidak Valid',
          message: 'Anda tidak memiliki akses yang sesuai',
          canAdd: false
        };
    }
  };

  const info = getMessage();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-4">
      <div className="text-center space-y-4 max-w-md mx-auto">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          {info.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {info.message}
        </p>
        
        <div className="flex flex-col gap-3 mt-4">
          {info.canAdd && (
            <button
              onClick={onAddClick}
              className="p-8 w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg 
                cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group"
            >
              <IconPlus className="w-12 h-12 mx-auto text-gray-400 group-hover:text-primary transition-colors" />
              <span className="mt-2 block text-sm text-gray-500 dark:text-gray-400">
                Tambah Data Awal
              </span>
            </button>
          )}
          
          <button
            onClick={onShowGuide}
            className="p-4 w-full border border-gray-200 dark:border-gray-700 rounded-lg 
              bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="block text-sm text-gray-600 dark:text-gray-400">
              Lihat Panduan Silsilah
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Komponen untuk template pohon kosong (dengan placeholder node)
const EmptyTreeTemplate: React.FC<{
  data: TreeNodeData;
  onNodeClick: (node: NodeClickData) => void;
  userRole: UserRole;
  onAddInitialData?: () => void;
}> = ({ data, onNodeClick, userRole, onAddInitialData }) => {
  const { containerRef, translate } = useCenteredTree();
  const { scale, zoomIn, zoomOut, resetZoom } = useZoom();
  const { position, handlePan, resetPosition } = usePan();
  
  // Gunakan useRef untuk menyimpan nilai terakhir dari translate
  const lastTranslateRef = useRef(translate);

  // Handler untuk reset view
  const handleResetView = useCallback(() => {
    resetZoom();
    resetPosition();
  }, [resetZoom, resetPosition]);

  // Simplifikasi data template untuk pohon kosong
  const simplifiedData = useMemo(() => {
    return {
      ...data,
      children: data.children?.map(child => ({
        ...child,
        nodeType: 'PLACEHOLDER',
        children: undefined 
      }))
    };
  }, [data]);

  // Handler untuk tree update yang di-throttle
  const handleTreeUpdate = useCallback(({ translate: newTranslate }: any) => {
    // Hanya panggil handlePan jika translate berubah signifikan
    const dx = Math.abs(newTranslate.x - lastTranslateRef.current.x);
    const dy = Math.abs(newTranslate.y - lastTranslateRef.current.y);
    
    if (dx > 1 || dy > 1) {
      lastTranslateRef.current = newTranslate;
      handlePan(newTranslate.x, newTranslate.y);
    }
  }, [handlePan]);

  // Custom node render menggunakan komponen TreeNode
  const renderCustomNode = useCallback(
    (rd: any) => (
      <TreeNode
        nodeData={{
          ...rd.nodeDatum,
          nodeType: rd.nodeDatum.nodeType || (rd.nodeDatum.id?.startsWith('placeholder-') ? 'PLACEHOLDER' : 'PERSON'),
        }}
        onNodeClick={onNodeClick}
        foreignObjectProps={{
          width: 320,
          height: 200,
          x: -160,
          y: -100,
        }}
        role={userRole}
      />
    ),
    [onNodeClick, userRole]
  );
  
  // Tambahan untuk Super Admin: Tombol langsung tambah data awal
  const renderAddButton = () => {
    if (userRole === 'SUPER_ADMIN' && onAddInitialData) {
      console.log("Rendering Add Button for Super Admin");
      return (
        <div className="absolute top-4 left-4 z-20">
          <Button
            variant="solid"
            size="md"
            onClick={() => {
              console.log("Add initial data button clicked");
              if (onAddInitialData) onAddInitialData();
            }}
            icon={<IconPlus className="w-4 h-4 mr-2" />}
          >
            Tambah Data Awal
          </Button>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[600px] relative bg-white dark:bg-gray-900"
    >
      {/* Pohon Keluarga Template */}
      <Tree
        data={simplifiedData}
        translate={translate}
        zoom={scale}
        renderCustomNodeElement={renderCustomNode}
        orientation="vertical"
        nodeSize={{ x: 350, y: 220 }}
        separation={{ siblings: 2.5, nonSiblings: 3 }}
        onUpdate={handleTreeUpdate}
        pathClassFunc={() => 'stroke-gray-300 dark:stroke-gray-700 stroke-[1.5px] stroke-dasharray-[5,5]'}
        // Gunakan pathFunc "step" alih-alih diagonal
        pathFunc="step"
        zoomable
        draggable
        collapsible={false}
        enableLegacyTransitions={false}
      />

      {/* Tombol tambah data awal untuk Super Admin */}
      {renderAddButton()}

      {/* Kontrol Panel */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <Tooltip content="Perbesar" placement="left">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            icon={<IconZoomIn className="w-4 h-4" />}
          />
        </Tooltip>

        <Tooltip content="Perkecil" placement="left">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            icon={<IconZoomOut className="w-4 h-4" />}
          />
        </Tooltip>

        <Tooltip content="Reset Tampilan" placement="left">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetView}
            icon={<IconRefresh className="w-4 h-4" />}
          />
        </Tooltip>
      </div>

      {/* Mini Map */}
      <MiniMap
        treeContainerRef={containerRef}
        scale={scale}
        translate={translate}
        position={position}
      />
    </div>
  );
};

// Komponen utama Family Tree
const FamilyTree: React.FC<FamilyTreeProps> = ({
  data,
  userRole,
  onNodeClick,
  onAddInitialData,
  className = '',
  maxLevels = 2
}) => {
  // Hooks untuk manipulasi tree
  const { containerRef, translate } = useCenteredTree();
  const { scale, zoomIn, zoomOut, resetZoom } = useZoom();
  const { position, handlePan, resetPosition } = usePan();
  
  // State untuk guide
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  
  // Ref untuk menyimpan posisi terakhir tanpa re-render
  const lastTranslateRef = useRef(translate);
  
  // Handler untuk reset view
  const handleResetView = useCallback(() => {
    resetZoom();
    resetPosition();
  }, [resetZoom, resetPosition]);

  // Cek apakah data kosong atau hanya template
  const isEmptyData = !data || Object.keys(data).length === 0;
  const isTemplateData = data?.id === 'root-template' || 
    (data?.children && data.children.some(c => c.id.startsWith('placeholder-')));

  // Preprocessor untuk data - Memastikan nodeType terset dengan benar
  const processedData = useMemo(() => {
    if (!data) return null;
    
    // Fungsi rekursif untuk memproses setiap node
    const processChildren = (children?: TreeNodeData[], currentLevel = 1): TreeNodeData[] | undefined => {
      if (!children) return undefined;
      
      return children.map(child => {
        // Tambahkan level pada tiap node untuk membantu styling dan permission
        const hasGrandchildren = child.children && child.children.length > 0;
        
        // Tentukan node type berdasarkan ID atau kondisi lain
        let nodeType = child.nodeType || 'PERSON';
        if (child.id?.startsWith('placeholder-')) {
          nodeType = 'PLACEHOLDER';
        }
        
        return {
          ...child,
          nodeType,
          level: currentLevel,
          hasChildren: hasGrandchildren,
          // Proses anak-anak secara rekursif jika tidak melebihi maxLevels
          children: currentLevel < maxLevels 
            ? processChildren(child.children, currentLevel + 1)
            : hasGrandchildren 
              ? [{ id: `${child.id}-more`, name: 'Lebih Banyak...', fullName: 'Klik untuk melihat lebih banyak', nodeType: 'EMPTY' }] 
              : undefined
        };
      });
    };
    
    return {
      ...data,
      nodeType: data.nodeType || 'PERSON',
      level: 0,
      hasChildren: data.children && data.children.length > 0,
      children: processChildren(data.children)
    };
  }, [data, maxLevels]);

  // Handler untuk tree update yang di-throttle
  const handleTreeUpdate = useCallback(({ translate: newTranslate }: any) => {
    // Hanya panggil handlePan jika translate berubah signifikan
    const dx = Math.abs(newTranslate.x - lastTranslateRef.current.x);
    const dy = Math.abs(newTranslate.y - lastTranslateRef.current.y);
    
    if (dx > 1 || dy > 1) {
      lastTranslateRef.current = newTranslate;
      handlePan(newTranslate.x, newTranslate.y);
    }
  }, [handlePan]);

  // Handler untuk klik node diserahkan ke parent atau default handler
  const handleNodeClick = useCallback((clickData: NodeClickData) => {
    console.log('Node clicked:', clickData);
    if (onNodeClick) {
      onNodeClick(clickData);
    }
  }, [onNodeClick]);

  // Fungsi untuk merender node custom
  const renderCustomNode = useCallback(({ nodeDatum }: { nodeDatum: TreeNodeData }) => {
    const canEdit = hasAccessLevel(userRole, Role.ADMIN_KELUARGA);
    const isPlaceholder = nodeDatum.nodeType === 'PLACEHOLDER';
    
    return (
      <g>
        {/* Node utama */}
        <circle
          r={20}
          fill={isPlaceholder ? '#e5e7eb' : nodeDatum.gender === 'FEMALE' ? '#fce7f3' : '#dbeafe'}
          stroke={isPlaceholder ? '#9ca3af' : nodeDatum.gender === 'FEMALE' ? '#f472b6' : '#60a5fa'}
          strokeWidth={2}
          className="cursor-pointer"
          onClick={() => {
            if (isPlaceholder && canEdit) {
              onNodeClick?.({ nodeData: nodeDatum, action: 'add' });
            } else if (!isPlaceholder) {
              onNodeClick?.({ nodeData: nodeDatum, action: 'details' });
            }
          }}
        />

        {/* Label nama */}
        <text
          dy="35"
          x="0"
          textAnchor="middle"
          style={{
            fill: isPlaceholder ? '#6b7280' : '#1f2937',
            fontSize: '14px'
          }}
          className="select-none cursor-pointer"
          onClick={() => {
            if (isPlaceholder && canEdit) {
              onNodeClick?.({ nodeData: nodeDatum, action: 'add' });
            } else if (!isPlaceholder) {
              onNodeClick?.({ nodeData: nodeDatum, action: 'details' });
            }
          }}
        >
          {nodeDatum.name}
        </text>

        {/* Tombol edit */}
        {!isPlaceholder && canEdit && (
          <g
            transform="translate(25, -25)"
            className="cursor-pointer"
            onClick={() => onNodeClick?.({ nodeData: nodeDatum, action: 'edit' })}
          >
            <circle r={12} fill="#f3f4f6" stroke="#9ca3af" strokeWidth={1} />
            <text
              dy="4"
              x="0"
              textAnchor="middle"
              style={{ fill: '#4b5563', fontSize: '12px' }}
              className="select-none"
            >
              ✎
            </text>
          </g>
        )}

        {/* Tombol tambah */}
        {!isPlaceholder && canEdit && (
          <g
            transform="translate(25, 25)"
            className="cursor-pointer"
            onClick={() => onNodeClick?.({ nodeData: nodeDatum, action: 'add' })}
          >
            <circle r={12} fill="#f3f4f6" stroke="#9ca3af" strokeWidth={1} />
            <text
              dy="4"
              x="0"
              textAnchor="middle"
              style={{ fill: '#4b5563', fontSize: '12px' }}
              className="select-none"
            >
              +
            </text>
          </g>
        )}
      </g>
    );
  }, [onNodeClick, userRole]);

  // Handlers untuk guide
  const handleShowGuide = useCallback(() => {
    setShowGuide(true);
    setGuideStep(0);
  }, []);

  const handleNextStep = useCallback(() => {
    setGuideStep(prev => prev + 1);
  }, []);

  const handlePrevStep = useCallback(() => {
    setGuideStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleFinishGuide = useCallback(() => {
    setShowGuide(false);
  }, []);

  // Render berdasarkan state data
  if (isEmptyData) {
    return (
      <div className={`h-full ${className}`}>
        {showGuide ? (
          <EmptyTreeGuide
            step={guideStep}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onFinish={handleFinishGuide}
            userRole={userRole}
          />
        ) : (
          <EmptyTreeState 
            role={userRole} 
            onAddClick={onAddInitialData}
            onShowGuide={handleShowGuide}
          />
        )}
      </div>
    );
  }

  if (isTemplateData) {
    return (
      <div className={`h-full ${className}`}>
        <EmptyTreeTemplate 
          data={data} 
          onNodeClick={handleNodeClick}
          userRole={userRole}
          onAddInitialData={onAddInitialData}
        />
      </div>
    );
  }

  // Default: Render pohon keluarga dengan data lengkap
  return (
    <div className={`h-full ${className}`}>
      <div 
        ref={containerRef}
        className="w-full h-full min-h-[600px] relative bg-white dark:bg-gray-900"
      >
        {processedData && (
          <Tree
            data={processedData}
            translate={translate}
            zoom={scale}
            renderCustomNodeElement={renderCustomNode}
            orientation="vertical"
            nodeSize={{ x: 350, y: 220 }}
            separation={{ siblings: 2.5, nonSiblings: 3 }}
            onUpdate={handleTreeUpdate}
            pathClassFunc={() => 'stroke-gray-300 dark:stroke-gray-700 stroke-[1.5px]'}
            // Gunakan pathFunc "step" alih-alih diagonal
            pathFunc="step"
            zoomable
            draggable
            collapsible={false}
            enableLegacyTransitions={false}
          />
        )}

        {/* Kontrol Panel */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <Tooltip content="Perbesar" placement="left">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              icon={<IconZoomIn className="w-4 h-4" />}
            />
          </Tooltip>

          <Tooltip content="Perkecil" placement="left">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              icon={<IconZoomOut className="w-4 h-4" />}
            />
          </Tooltip>

          <Tooltip content="Reset Tampilan" placement="left">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetView}
              icon={<IconRefresh className="w-4 h-4" />}
            />
          </Tooltip>

          <Tooltip content="Lihat Panduan" placement="left">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowGuide}
              icon={<IconRefresh className="w-4 h-4" />}
            />
          </Tooltip>
        </div>

        {/* Mini Map */}
        <MiniMap
          treeContainerRef={containerRef}
          scale={scale}
          translate={translate}
          position={position}
        />
      </div>

      {/* Modal untuk Guide */}
      <Modal
        open={showGuide}
        onClose={handleFinishGuide}
        size="lg"
        className="p-0"
      >
        <EmptyTreeGuide
          step={guideStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onFinish={handleFinishGuide}
          userRole={userRole}
        />
      </Modal>
    </div>
  );
};

export default FamilyTree;
// end of frontend/components/family-tree/FamilyTree.tsx