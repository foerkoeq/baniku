// start of frontend/components/events/CommitteeSection.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Select from '@/components/forms/Select';
import Button from '@/components/ui/button';
import IconPlus from '@/components/icon/icon-plus';
import IconX from '@/components/icon/icon-x';
import { CommitteeMember, BaniData } from './types';
import { getBaniLevel, getBaniChildren, getBaniParent } from '@/utils/BaniHelpers';

interface CommitteeSectionProps {
    userRole: string;
    userBaniId: string;
    baniList: BaniData[];
    selectedHostBani?: string;
    committeeMembers: CommitteeMember[];
    onUpdate: (hostBaniId: string, members: CommitteeMember[]) => void;
}

const CommitteeSection: React.FC<CommitteeSectionProps> = ({
    userRole,
    userBaniId,
    baniList,
    selectedHostBani,
    committeeMembers,
    onUpdate
}) => {
    const [hostBani, setHostBani] = useState(selectedHostBani);
    const [availableBanis, setAvailableBanis] = useState<BaniData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const filterBanis = async () => {
            setLoading(true);
            try {
                if (userRole === 'SUPER_ADMIN') {
                    // Ambil semua bani level 2
                    const level2Banis = await Promise.all(
                        baniList.map(async (bani) => {
                            const level = await getBaniLevel(bani.id);
                            return { ...bani, level };
                        })
                    );
                    setAvailableBanis(level2Banis.filter(bani => bani.level === 2));
                } else {
                    // Untuk Admin Bani, ambil bani dibawahnya
                    const userBaniLevel = await getBaniLevel(userBaniId);
                    const childrenIds = await getBaniChildren(userBaniId);
                    
                    // Filter bani list berdasarkan children
                    const filteredBanis = baniList.filter(bani => 
                        childrenIds.includes(bani.id)
                    );

                    setAvailableBanis(filteredBanis);
                }
            } catch (error) {
                console.error('Error filtering banis:', error);
                setAvailableBanis([]);
            } finally {
                setLoading(false);
            }
        };

        filterBanis();
    }, [userRole, baniList, userBaniId]);

    const handleHostBaniChange = async (baniId: string) => {
        setHostBani(baniId);
        
        try {
            // Fetch kepala keluarga dari bani terpilih dan bani dibawahnya
            const response = await fetch(`/api/banis/${baniId}/family-heads?includeSub=true`);
            const data = await response.json();
            
            // Auto-assign kepala keluarga sebagai panitia
            const autoMembers: CommitteeMember[] = await Promise.all(
                data.familyHeads.map(async (head: any) => {
                    const headBaniLevel = await getBaniLevel(head.baniId);
                    return {
                        userId: head.userId,
                        personId: head.id,
                        fullName: head.fullName,
                        role: headBaniLevel === 2 ? 'COORDINATOR' : 'MEMBER',
                        baniId: head.baniId
                    };
                })
            );

            // Sort members: coordinator first, then others by bani level
            const sortedMembers = autoMembers.sort((a, b) => {
                if (a.role === 'COORDINATOR') return -1;
                if (b.role === 'COORDINATOR') return 1;
                return 0;
            });

            onUpdate(baniId, sortedMembers);
        } catch (error) {
            console.error('Error fetching family heads:', error);
        }
    };

    const addCommitteeMember = async (personId: string) => {
        try {
            // Fetch person details
            const response = await fetch(`/api/persons/${personId}`);
            const data = await response.json();
            
            // Check if person is already in committee
            if (committeeMembers.some(member => member.personId === personId)) {
                return;
            }

            const newMember: CommitteeMember = {
                userId: data.person.userId,
                personId: data.person.id,
                fullName: data.person.fullName,
                role: 'MEMBER',
                baniId: data.person.baniId
            };

            onUpdate(hostBani!, [...committeeMembers, newMember]);
        } catch (error) {
            console.error('Error adding committee member:', error);
        }
    };

    const removeCommitteeMember = (personId: string) => {
        const newMembers = committeeMembers.filter(member => 
            member.personId !== personId || member.role === 'COORDINATOR'
        );
        onUpdate(hostBani!, newMembers);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Tuan Rumah & Kepanitiaan</h3>
                <Select
                    label="Bani Tuan Rumah"
                    options={availableBanis.map(bani => ({
                        value: bani.id,
                        label: bani.name
                    }))}
                    value={hostBani}
                    onChange={handleHostBaniChange}
                    placeholder="Pilih bani tuan rumah..."
                    isLoading={loading}
                />
            </div>

            {hostBani && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Daftar Panitia</h4>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                // TODO: Tambahkan modal untuk memilih anggota tambahan
                            }}
                        >
                            <IconPlus className="w-4 h-4 mr-2" />
                            Tambah Panitia
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {committeeMembers.map((member) => (
                            <div 
                                key={member.personId} 
                                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="font-medium">{member.fullName}</p>
                                    <p className="text-sm text-gray-500">
                                        {member.role === 'COORDINATOR' ? 'Koordinator' : 'Anggota'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {member.role !== 'COORDINATOR' && (
                                        <Select
                                            value={member.role}
                                            onChange={(value) => {
                                                const newMembers = committeeMembers.map(m => 
                                                    m.personId === member.personId 
                                                        ? { ...m, role: value as 'MEMBER' | 'COORDINATOR' }
                                                        : m
                                                );
                                                onUpdate(hostBani, newMembers);
                                            }}
                                            options={[
                                                { value: 'MEMBER', label: 'Anggota' },
                                                { value: 'COORDINATOR', label: 'Koordinator' }
                                            ]}
                                            className="w-32"
                                        />
                                    )}
                                    {member.role !== 'COORDINATOR' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            color="danger"
                                            onClick={() => removeCommitteeMember(member.personId)}
                                        >
                                            <IconX className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommitteeSection;
// end of frontend/components/events/CommitteeSection.tsx